<?php
/**
 * Раздел «Граница Нарва — Ивангород»: общая часть ленты, записей и админки.
 *
 * Зачем PHP, если сайт статический: записи публикуются из админки сразу, без
 * пересборки и деплоя. Node на хостинге нет, PHP 8.3 с pdo_sqlite есть
 * (проверено 01.10.2026). Вёрстку при этом делает Astro: он собирает два
 * шаблона — dist/granica-narva-ivangorod/shablon/{lenta,zapis}/index.html — с
 * настоящими шапкой, подвалом и стилями, а здесь в них подставляются данные.
 * Отсюда и правило: HTML здесь не пишем, классы Tailwind здесь не работают.
 *
 * Метки в шаблонах:
 *   __ИМЯ__                      значение; экранируется здесь, в тексте и в атрибутах
 *   __ИМЯ_BEGIN__…__ИМЯ_END__    блок: повторить по записям, оставить или убрать
 *   метка внутри JSON-LD         заменяется на уровне данных, после json_decode, —
 *                                кавычка или </script> в заголовке разметку не ломают
 *
 * Данные — SQLite ВНЕ htdocs, рядом с hits.json: деплой (а rsync в workflow —
 * с --delete) синхронизирует htdocs и стёр бы базу внутри него.
 *
 * Этот каталог наружу не отдаётся: в .htaccess на /_blog/ стоит 404.
 */

declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(E_ALL);

const BLOG_SITE = 'https://estoniatransfer.ee';
const BLOG_HOST = 'estoniatransfer.ee';
/** Путь раздела. Тот же в src/data/border.ts и в public/.htaccess. */
const BLOG_PATH = '/granica-narva-ivangorod/';
const BLOG_PER_PAGE = 20;
/** Время записей — по Эстонии; московское показываем рядом, когда оно другое. */
const BLOG_TZ = 'Europe/Tallinn';
const BLOG_TZ_RU = 'Europe/Moscow';
/** Тот же ключ, что в tools/indexnow.sh и public/<ключ>.txt. */
const BLOG_INDEXNOW_KEY = '8f832852ef7447b79a893e449784ffe2';
/** Слаги, которые заняты служебными адресами раздела. */
const BLOG_RESERVED = ['shablon', 'stranica', 'sitemap', 'admin', 'index'];

/**
 * Вход в админку. Прошит в коде намеренно — решение владельца для первой
 * версии (01.10.2026), владелец знает, что это небезопасно. Подбор
 * ограничивает admin_locked() в admin/index.php. Меняется здесь.
 */
const BLOG_ADMIN_USER = 'admin';
const BLOG_ADMIN_PASS = '777';

define('BLOG_DOCROOT', dirname(__DIR__));
/** ET_BLOG_DATA — только для проверки на своей машине, на хостинге не задаётся. */
define('BLOG_DATA', getenv('ET_BLOG_DATA') ?: dirname(BLOG_DOCROOT) . '/granica-blog');

const BLOG_MONTHS = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

// ---------------------------------------------------------------------------
// База
// ---------------------------------------------------------------------------

function blog_db(): PDO
{
    static $db = null;
    if ($db instanceof PDO) {
        return $db;
    }
    if (!is_dir(BLOG_DATA) && !@mkdir(BLOG_DATA, 0700, true) && !is_dir(BLOG_DATA)) {
        throw new RuntimeException('Нет каталога данных ' . BLOG_DATA);
    }
    $db = new PDO('sqlite:' . BLOG_DATA . '/blog.sqlite', null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    // WAL не включаем: на сетевом диске хостинга он ненадёжен, а нагрузка
    // здесь — один автор и чтение ленты.
    $db->exec('PRAGMA busy_timeout = 5000');
    $db->exec(<<<'SQL'
        CREATE TABLE IF NOT EXISTS posts (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            slug            TEXT    NOT NULL UNIQUE,
            title           TEXT    NOT NULL,
            body            TEXT    NOT NULL,
            seo_title       TEXT    NOT NULL DEFAULT '',
            seo_description TEXT    NOT NULL DEFAULT '',
            -- draft | published | deleted. Удалённая запись остаётся строкой:
            -- её адрес отвечает 410, и слаг не достаётся новой записи.
            status          TEXT    NOT NULL DEFAULT 'draft',
            created_at      INTEGER NOT NULL,
            published_at    INTEGER,
            -- правка ТЕКСТА: dateModified и lastmod карты
            updated_at      INTEGER NOT NULL,
            -- любая правка, включая статус: Last-Modified ленты
            touched_at      INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS posts_feed ON posts (status, published_at DESC);
        CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS login_failures (ip TEXT NOT NULL, at INTEGER NOT NULL);
        SQL);
    return $db;
}

/**
 * Секрет для подписи cookie админки и ссылок предпросмотра. Генерируется при
 * первом обращении и живёт только в базе: репозиторий публичный.
 */
function blog_secret(): string
{
    $db = blog_db();
    $value = $db->query("SELECT value FROM meta WHERE key = 'secret'")->fetchColumn();
    if (is_string($value) && $value !== '') {
        return $value;
    }
    $value = bin2hex(random_bytes(32));
    $db->prepare("INSERT OR IGNORE INTO meta (key, value) VALUES ('secret', ?)")->execute([$value]);
    return (string) $db->query("SELECT value FROM meta WHERE key = 'secret'")->fetchColumn();
}

function blog_count_published(): int
{
    return (int) blog_db()->query("SELECT COUNT(*) FROM posts WHERE status = 'published'")->fetchColumn();
}

/** @return list<array<string,mixed>> опубликованные, новые сверху */
function blog_published(int $limit, int $offset = 0, int $exclude = 0): array
{
    $st = blog_db()->prepare(
        "SELECT * FROM posts WHERE status = 'published' AND id != :ex
         ORDER BY published_at DESC, id DESC LIMIT :lim OFFSET :off"
    );
    $st->bindValue(':ex', $exclude, PDO::PARAM_INT);
    $st->bindValue(':lim', $limit, PDO::PARAM_INT);
    $st->bindValue(':off', $offset, PDO::PARAM_INT);
    $st->execute();
    return $st->fetchAll();
}

function blog_post(int $id): ?array
{
    $st = blog_db()->prepare('SELECT * FROM posts WHERE id = ?');
    $st->execute([$id]);
    return $st->fetch() ?: null;
}

function blog_post_by_slug(string $slug): ?array
{
    $st = blog_db()->prepare('SELECT * FROM posts WHERE slug = ?');
    $st->execute([$slug]);
    return $st->fetch() ?: null;
}

/**
 * Последняя перемена, видная снаружи: публикация, правка опубликованного,
 * снятие с публикации, удаление. Черновик, ни разу не выходивший, не в счёт.
 * Отсюда Last-Modified раздела, а также lastmod и dateModified ленты.
 */
function blog_touched(): int
{
    return (int) blog_db()->query('SELECT COALESCE(MAX(touched_at), 0) FROM posts WHERE published_at IS NOT NULL')->fetchColumn();
}

// ---------------------------------------------------------------------------
// Слаг
// ---------------------------------------------------------------------------

/**
 * Латиница из заголовка. Схема та же, что у остальных адресов сайта:
 * «kak-dobratsya-do-granicy» — ц→c, ы→y, ь пропадает.
 */
function blog_slugify(string $text): string
{
    static $map = [
        'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'e',
        'ж' => 'zh', 'з' => 'z', 'и' => 'i', 'й' => 'y', 'к' => 'k', 'л' => 'l', 'м' => 'm',
        'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't', 'у' => 'u',
        'ф' => 'f', 'х' => 'h', 'ц' => 'c', 'ч' => 'ch', 'ш' => 'sh', 'щ' => 'shch', 'ъ' => '',
        'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu', 'я' => 'ya',
        // эстонские буквы: Narva-1, Ülenurme и прочее, что попадёт в заголовок
        'õ' => 'o', 'ä' => 'a', 'ö' => 'o', 'ü' => 'u', 'š' => 's', 'ž' => 'z',
    ];
    $s = strtr(mb_strtolower($text, 'UTF-8'), $map);
    $s = trim((string) preg_replace('/[^a-z0-9]+/', '-', $s), '-');
    if (strlen($s) > 60) {
        $cut = substr($s, 0, 61);
        $s = rtrim(substr($cut, 0, (int) (strrpos($cut, '-') ?: 60)), '-');
    }
    return $s;
}

/** Свободный слаг: при совпадении — -2, -3… Удалённые записи слаг держат. */
function blog_unique_slug(string $base, int $selfId = 0): string
{
    $st = blog_db()->prepare('SELECT 1 FROM posts WHERE slug = ? AND id != ?');
    for ($n = 1; ; $n++) {
        $slug = $n === 1 ? $base : "$base-$n";
        if (in_array($slug, BLOG_RESERVED, true)) {
            continue;
        }
        $st->execute([$slug, $selfId]);
        if ($st->fetchColumn() === false) {
            return $slug;
        }
    }
}

// ---------------------------------------------------------------------------
// Текст записи: упрощённый Markdown
// ---------------------------------------------------------------------------

function blog_e(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, 'UTF-8');
}

/**
 * Текст записи в HTML. Поддерживается ровно то, что описано в подсказке
 * админки: абзацы, ## и ### подзаголовки, списки, **жирный**, [ссылки](…).
 *
 * Сырой HTML не проходит — всё экранируется ДО разметки. Пароль из трёх
 * цифр означает, что писать сюда может кто угодно, и <script> в записи не
 * должен стать скриптом на сайте.
 *
 * $base — уровень, который получит «##». На странице записи под H1 это 2, в
 * ленте запись стоит под H3, и там 4. «###» до первого «##» поднимается до
 * $base: скачок H1 → H3 сайт считает ошибкой (CLAUDE.md, 5.3).
 */
function blog_render_body(string $md, int $base = 2): string
{
    $lines = explode("\n", str_replace(["\r\n", "\r"], "\n", trim($md)));
    $out = [];
    $buf = [];
    $kind = '';
    $seenTop = false;

    $flush = function () use (&$out, &$buf, &$kind): void {
        if ($buf) {
            $out[] = match ($kind) {
                'ul' => '<ul>' . implode('', array_map(fn($l) => "<li>$l</li>", $buf)) . '</ul>',
                'ol' => '<ol>' . implode('', array_map(fn($l) => "<li>$l</li>", $buf)) . '</ol>',
                default => '<p>' . implode('<br>', $buf) . '</p>',
            };
        }
        $buf = [];
        $kind = '';
    };

    foreach ($lines as $raw) {
        $line = trim($raw);
        if ($line === '') {
            $flush();
            continue;
        }
        if (preg_match('/^(#{1,6})\s+(.+)$/u', $line, $m)) {
            $flush();
            $deep = strlen($m[1]) >= 3 && $seenTop;
            $seenTop = true;
            $level = min(6, $base + ($deep ? 1 : 0));
            $out[] = "<h$level>" . blog_inline($m[2]) . "</h$level>";
            continue;
        }
        if (preg_match('/^[-*•]\s+(.+)$/u', $line, $m)) {
            if ($kind !== 'ul') {
                $flush();
                $kind = 'ul';
            }
            $buf[] = blog_inline($m[1]);
            continue;
        }
        if (preg_match('/^\d{1,3}[.)]\s+(.+)$/u', $line, $m)) {
            if ($kind !== 'ol') {
                $flush();
                $kind = 'ol';
            }
            $buf[] = blog_inline($m[1]);
            continue;
        }
        if ($kind !== 'p') {
            $flush();
            $kind = 'p';
        }
        $buf[] = blog_inline($line);
    }
    $flush();
    return implode("\n", $out);
}

/** Строка: экранирование, потом **жирный** и [ссылки](адрес). */
function blog_inline(string $s): string
{
    $s = blog_e($s);
    $s = (string) preg_replace_callback(
        '/\[([^\]]+)\]\(([^)\s]+)\)/u',
        function (array $m): string {
            // адрес уже экранирован вместе со строкой — кавычкой из атрибута не выйти
            $href = html_entity_decode($m[2], ENT_QUOTES | ENT_HTML5, 'UTF-8');
            if (preg_match('~^/(?!/)~', $href)) {
                return '<a href="' . blog_e($href) . '">' . $m[1] . '</a>';
            }
            if (preg_match('~^https?://~i', $href)) {
                $own = preg_match('~^https?://(www\.)?estoniatransfer\.ee(/|$)~i', $href) === 1;
                return '<a href="' . blog_e($href) . '"' . ($own ? '' : ' target="_blank" rel="noopener nofollow"') . '>' . $m[1] . '</a>';
            }
            return $m[0]; // javascript: и прочее — остаётся текстом
        },
        $s
    );
    return (string) preg_replace('/\*\*(.+?)\*\*/u', '<strong>$1</strong>', $s);
}

/**
 * Текст записи без разметки — для description и анонса в ленте.
 *
 * Читается как связный текст, а не как обрывки строк: подзаголовки
 * пропускаются (это подписи, а не фразы), пункты списка склеиваются через
 * «;» в одну фразу, строка без знака на конце получает точку.
 */
function blog_plain(string $md): string
{
    $parts = [];
    $items = [];
    $flushItems = function () use (&$parts, &$items): void {
        if (!$items) {
            return;
        }
        $list = implode('; ', $items) . '.';
        $last = array_key_last($parts);
        if ($last !== null && str_ends_with($parts[$last], ':')) {
            $parts[$last] .= ' ' . $list; // «Сейчас: 50 человек; 20 машин.»
        } else {
            $parts[] = mb_strtoupper(mb_substr($list, 0, 1)) . mb_substr($list, 1);
        }
        $items = [];
    };

    foreach (explode("\n", str_replace(["\r\n", "\r"], "\n", $md)) as $line) {
        $line = trim($line);
        if ($line === '' || preg_match('/^#{1,6}\s+/u', $line) === 1) {
            $flushItems();
            continue;
        }
        $text = (string) preg_replace('/^([-*•]|\d{1,3}[.)])\s+/u', '', $line, 1, $isItem);
        $text = str_replace('**', '', (string) preg_replace('/\[([^\]]+)\]\([^)\s]+\)/u', '$1', $text));
        if ($isItem > 0) {
            // rtrim здесь безопасен: в списке только ASCII-знаки
            $items[] = rtrim($text, ' ;,.');
            continue;
        }
        $flushItems();
        $parts[] = preg_match('/[.!?…:;]$/u', $text) === 1 ? $text : $text . '.';
    }
    $flushItems();
    return trim((string) preg_replace('/\s+/u', ' ', implode(' ', $parts)));
}

/** Обрезать по слову, не длиннее $max вместе с многоточием. */
function blog_cut(string $s, int $max): string
{
    if (mb_strlen($s) <= $max) {
        return $s;
    }
    $cut = mb_substr($s, 0, $max - 1);
    $space = mb_strrpos($cut, ' ');
    if ($space !== false && $space > $max * 0.6) {
        $cut = mb_substr($cut, 0, $space);
    }
    // Регуляркой с /u, а не rtrim: rtrim режет по БАЙТАМ, и «—» в его списке
    // снимал бы хвостовой байт 0x80 у «р» (D1 80) — текст ломался бы посреди буквы.
    return (string) preg_replace('/[\s,;:—–\-.]+$/u', '', $cut) . '…';
}

// ---------------------------------------------------------------------------
// SEO записи — то, что каждая новая запись получает сама
// ---------------------------------------------------------------------------

/**
 * <title> записи, до 60 знаков. Если в заголовке нет обоих городов, к нему
 * дописывается хвост с ними — самый длинный из тех, что влезают. Запрос
 * «очередь в Ивангороде» ищет город, и запись «Очередь в 14:00» без хвоста
 * по нему не найдётся.
 */
function blog_title_tag(array $post): string
{
    $own = trim((string) $post['seo_title']);
    if ($own !== '') {
        return $own;
    }
    $title = (string) $post['title'];
    $hasCities = mb_stripos($title, 'нарв') !== false && mb_stripos($title, 'ивангород') !== false;
    if (!$hasCities) {
        foreach ([' · граница Нарва — Ивангород', ' · Нарва — Ивангород'] as $tail) {
            if (mb_strlen($title . $tail) <= 60) {
                return $title . $tail;
            }
        }
    }
    return blog_cut($title, 60);
}

/**
 * meta description, 140–160 знаков: своё из админки или первые фразы текста.
 * Короткий текст добирается фразой с ключом, длинный режется по слову.
 */
function blog_description(array $post): string
{
    $own = trim((string) $post['seo_description']);
    if ($own !== '') {
        return $own;
    }
    $text = blog_plain((string) $post['body']);
    if ($text === '') {
        $text = (string) $post['title'];
    }
    if (mb_strlen($text) > 160) {
        return blog_cut($text, 160);
    }
    if (mb_strlen($text) >= 140) {
        return $text;
    }
    if (!preg_match('/[.!?…]$/u', $text)) {
        $text .= '.';
    }
    // Короткую сводку добираем до 140–160 фразами о разделе — все они правда
    // про любую запись. Берём сочетание, которое ближе всего к 150; не
    // выходит попасть в окно — самое длинное, что влезает в 160.
    $a = ' Сводки об очереди на границе Нарва — Ивангород.';
    $b = ' Пешеходный переход, режим работы и телефоны пунктов пропуска.';
    $c = ' Режим перехода и телефоны пунктов пропуска.';
    $d = ' Свежие данные — в ленте сводок.';
    $best = $text;
    $bestScore = PHP_INT_MAX;
    foreach (['', $a, $a . $b, $a . $c, $a . $d, $a . $c . $d, $b, $c, $d, $c . $d] as $tail) {
        $n = mb_strlen($text . $tail);
        if ($n > 160) {
            continue;
        }
        // в окне — штраф за расстояние от 150; ниже окна — за недобор, и всегда хуже окна
        $score = $n >= 140 ? abs($n - 150) : 1000 + (140 - $n);
        if ($score < $bestScore) {
            $best = $text . $tail;
            $bestScore = $score;
        }
    }
    return $best;
}

function blog_excerpt(array $post, int $max = 180): string
{
    return blog_cut(blog_plain((string) $post['body']), $max);
}

function blog_url(array $post): string
{
    return BLOG_PATH . $post['slug'] . '/';
}

// ---------------------------------------------------------------------------
// Даты
// ---------------------------------------------------------------------------

function blog_time(int $ts, string $tz = BLOG_TZ): DateTimeImmutable
{
    return (new DateTimeImmutable('@' . $ts))->setTimezone(new DateTimeZone($tz));
}

function blog_iso(int $ts): string
{
    return blog_time($ts)->format(DATE_ATOM);
}

/**
 * «1 ноября 2026, 14:30». С $zones — ещё и пояс, а московское время рядом,
 * если оно расходится с эстонским: с последнего воскресенья октября до
 * последнего воскресенья марта Ивангород живёт на час впереди Нарвы, и
 * «очередь в 14:00» без пояса читается двумя способами.
 */
function blog_when(int $ts, bool $zones = false): string
{
    $ee = blog_time($ts);
    $s = (int) $ee->format('j') . ' ' . BLOG_MONTHS[(int) $ee->format('n') - 1] . ' ' . $ee->format('Y, H:i');
    if (!$zones) {
        return $s;
    }
    $ru = blog_time($ts, BLOG_TZ_RU);
    if ($ru->getOffset() === $ee->getOffset()) {
        return $s; // летом время одно, путать нечего
    }
    return $s . ' по эстонскому времени (' . $ru->format('H:i') . ' по московскому)';
}

// ---------------------------------------------------------------------------
// Шаблон
// ---------------------------------------------------------------------------

function blog_template_file(string $name): string
{
    return BLOG_DOCROOT . BLOG_PATH . 'shablon/' . $name . '/index.html';
}

/** Страница из собранного Astro шаблона: блоки, повторы, подстановка. */
final class BlogPage
{
    /** @var array<string,string> готовые куски, которые второй раз не сканируются */
    private array $slots = [];

    public function __construct(private string $html)
    {
    }

    public static function load(string $name): self
    {
        $html = @file_get_contents(blog_template_file($name));
        if ($html === false) {
            throw new RuntimeException("Нет шаблона «{$name}» — сайт собран без раздела?");
        }
        return new self($html);
    }

    /** Оставить блок (без меток) или убрать целиком. */
    public function block(string $name, bool $keep): self
    {
        $this->html = (string) preg_replace_callback(
            '~__' . $name . '_BEGIN__(.*?)__' . $name . '_END__~s',
            fn(array $m) => $keep ? $m[1] : '',
            $this->html
        );
        return $this;
    }

    /**
     * Повторить блок по строкам. Строка — метка => текст; метки из $raw
     * вставляются как готовый HTML (текст записи), остальные экранируются.
     *
     * @param list<array<string,string>> $rows
     * @param list<string> $raw
     */
    public function repeat(string $name, array $rows, array $raw = []): self
    {
        $this->html = (string) preg_replace_callback(
            '~__' . $name . '_BEGIN__(.*?)__' . $name . '_END__~s',
            function (array $m) use ($rows, $raw): string {
                $out = '';
                foreach ($rows as $row) {
                    $map = [];
                    foreach ($row as $k => $v) {
                        $map[$k] = in_array($k, $raw, true) ? $v : blog_e($v);
                    }
                    $out .= strtr($m[1], $map);
                }
                $key = "\x00slot" . count($this->slots) . "\x00";
                $this->slots[$key] = $out;
                return $key;
            },
            $this->html
        );
        return $this;
    }

    /** Атрибут content у <meta property="…"> — нужен og:image для разметки. */
    public function meta(string $property): ?string
    {
        $re = '~<meta property="' . preg_quote($property, '~') . '" content="([^"]*)"~';
        return preg_match($re, $this->html, $m) ? html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8') : null;
    }

    /**
     * Готовый HTML.
     *
     * @param array<string,string> $text метка => значение, экранируется
     * @param array<string,string> $raw  метка => готовый HTML
     * @param array<string,mixed>  $data метка, стоящая ЦЕЛЫМ значением в JSON-LD
     *                                   => что поставить вместо (null — убрать ключ)
     */
    public function render(array $text, array $raw = [], array $data = []): string
    {
        $map = $this->slots;
        $i = 0;
        $html = (string) preg_replace_callback(
            '~(<script type="application/ld\+json"[^>]*>)(.*?)(</script>)~s',
            function (array $m) use (&$map, &$i, $text, $data): string {
                $json = json_decode($m[2], true);
                if (!is_array($json)) {
                    return $m[0];
                }
                $json = blog_json_fill($json, $text, $data);
                $key = "\x00ld" . $i++ . "\x00";
                // HEX_TAG: «</script>» в заголовке записи не закроет тег раньше времени
                $map[$key] = $m[1] . json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . $m[3];
                return $key;
            },
            $this->html
        );
        foreach ($text as $k => $v) {
            $map[$k] = blog_e($v);
        }
        foreach ($raw as $k => $v) {
            $map[$k] = $v;
        }
        // strtr за один проход: подставленное повторно не сканируется
        return strtr($html, $map);
    }
}

/** Метки внутри JSON-LD: подстановка в строки и замена целых значений. */
function blog_json_fill(array $node, array $text, array $data): array
{
    $isList = array_is_list($node);
    foreach ($node as $k => $v) {
        if (is_array($v)) {
            $node[$k] = blog_json_fill($v, $text, $data);
        } elseif (is_string($v)) {
            if (array_key_exists($v, $data)) {
                if ($data[$v] === null) {
                    unset($node[$k]);
                } else {
                    $node[$k] = $data[$v];
                }
            } else {
                $node[$k] = strtr($v, $text);
            }
        }
    }
    return $isList ? array_values($node) : $node;
}

// ---------------------------------------------------------------------------
// Ответ
// ---------------------------------------------------------------------------

/**
 * Last-Modified и 304 на If-Modified-Since. Яндекс отдельно просит это у
 * часто меняющихся страниц: краулер не скачивает ленту заново, если в ней
 * ничего не появилось, и тратит обход на новые записи.
 */
function blog_conditional(int $lastmod): void
{
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $lastmod) . ' GMT');
    $since = $_SERVER['HTTP_IF_MODIFIED_SINCE'] ?? '';
    if ($since !== '') {
        $t = strtotime($since);
        if ($t !== false && $t >= $lastmod) {
            http_response_code(304);
            exit;
        }
    }
}

/** Дата, после которой поменялся бы HTML при тех же данных: шаблон и этот код. */
function blog_code_mtime(string ...$templates): int
{
    $t = max((int) @filemtime(__FILE__), (int) @filemtime(BLOG_DOCROOT . BLOG_PATH . 'index.php'));
    foreach ($templates as $name) {
        $t = max($t, (int) @filemtime(blog_template_file($name)));
    }
    return $t;
}

function blog_send_html(string $html): never
{
    header('Content-Type: text/html; charset=utf-8');
    echo $html;
    exit;
}

/** 404 (нет такой) или 410 (была и удалена — поисковик уберёт её быстрее). */
function blog_not_found(int $code = 404): never
{
    http_response_code($code);
    header('Content-Type: text/html; charset=utf-8');
    $page = @file_get_contents(BLOG_DOCROOT . '/404.html');
    echo $page !== false ? $page : '<!doctype html><meta charset="utf-8"><title>Страница не найдена</title><p>Страница не найдена. <a href="/">На главную</a></p>';
    exit;
}

function blog_redirect(string $path, int $code = 301): never
{
    header('Location: ' . BLOG_SITE . $path, true, $code);
    exit;
}

// ---------------------------------------------------------------------------
// Страницы раздела
// ---------------------------------------------------------------------------

/** @return array<string,string> */
function blog_item_row(array $p): array
{
    return [
        '__ITEM_URL__' => blog_url($p),
        '__ITEM_TITLE__' => (string) $p['title'],
        '__ITEM_ISO__' => blog_iso((int) $p['published_at']),
        '__ITEM_WHEN__' => blog_when((int) $p['published_at']),
        '__ITEM_EXCERPT__' => blog_excerpt($p),
    ];
}

/** Короткий узел записи для списка blogPost в разметке ленты. */
function blog_post_stub(array $p): array
{
    $url = BLOG_SITE . blog_url($p);
    return [
        '@type' => 'BlogPosting',
        '@id' => $url . '#article',
        'url' => $url,
        'headline' => blog_cut((string) $p['title'], 110),
        'datePublished' => blog_iso((int) $p['published_at']),
        'dateModified' => blog_iso((int) $p['updated_at']),
    ];
}

/** Лента: /granica-narva-ivangorod/ и /granica-narva-ivangorod/stranica/N/. */
function blog_render_hub(int $page): never
{
    $total = blog_count_published();
    // первая запись ленты стоит отдельно, «Последнее обновление»; страницы
    // считаются по остальным
    $pages = max(1, (int) ceil(max(0, $total - 1) / BLOG_PER_PAGE));
    if ($page < 1 || $page > $pages) {
        blog_not_found();
    }

    blog_conditional(max(blog_touched(), blog_code_mtime('lenta')));

    $newest = $total > 0 ? blog_published(1)[0] : null;
    $latest = $page === 1 ? $newest : null;
    $items = $total > 1 ? blog_published(BLOG_PER_PAGE, 1 + ($page - 1) * BLOG_PER_PAGE) : [];
    $shown = array_merge($latest ? [$latest] : [], $items);

    $p = BlogPage::load('lenta')
        ->block('FIRST_PAGE', $page === 1)
        ->block('HAS_POSTS', $newest !== null)
        ->repeat('LATEST', $latest ? [[
            '__LATEST_URL__' => blog_url($latest),
            '__LATEST_TITLE__' => (string) $latest['title'],
            '__LATEST_ISO__' => blog_iso((int) $latest['published_at']),
            '__LATEST_WHEN__' => blog_when((int) $latest['published_at'], true),
            '__LATEST_BODY__' => blog_render_body((string) $latest['body'], 4),
        ]] : [], ['__LATEST_BODY__'])
        ->block('UPDATES', $items !== [] || $total === 0)
        ->block('EMPTY', $total === 0)
        ->block('LIST', $items !== [])
        ->repeat('ITEM', array_map('blog_item_row', $items))
        ->block('PAGER', $pages > 1)
        ->block('PREV', $page > 1)
        ->block('NEXT', $page < $pages);

    $pagePath = $page > 1 ? "stranica/$page/" : '';
    $modified = blog_touched();

    blog_send_html($p->render(
        [
            '__HUB_PAGE_PATH__' => $pagePath,
            '__HUB_PAGE_SUFFIX__' => $page > 1 ? " — страница $page" : '',
            '__HUB_DESC_SUFFIX__' => $page > 1 ? " Страница $page." : '',
            '__HUB_UPDATED_ISO__' => $newest ? blog_iso((int) $newest['published_at']) : '',
            '__HUB_UPDATED_WHEN__' => $newest ? blog_when((int) $newest['published_at']) : '',
            '__PREV_URL__' => $page > 2 ? BLOG_PATH . 'stranica/' . ($page - 1) . '/' : BLOG_PATH,
            '__NEXT_URL__' => BLOG_PATH . 'stranica/' . ($page + 1) . '/',
            '__PAGE_NUM__' => (string) $page,
            '__PAGE_TOTAL__' => (string) $pages,
        ],
        [],
        [
            '__HUB_MODIFIED__' => $modified > 0 ? blog_iso($modified) : null,
            '__HUB_POSTS__' => $shown ? array_map('blog_post_stub', $shown) : null,
        ]
    ));
}

/** Запись: /granica-narva-ivangorod/<slug>/. */
function blog_render_post(string $slug, ?string $preview): never
{
    if (preg_match('/^[a-z0-9-]{1,80}$/', $slug) !== 1) {
        blog_not_found();
    }
    $post = blog_post_by_slug($slug);
    if ($post === null) {
        blog_not_found();
    }
    if ($post['status'] === 'deleted') {
        blog_not_found(410);
    }
    $isPreview = false;
    if ($post['status'] !== 'published') {
        if ($preview === null || !hash_equals(blog_preview_token($post), $preview)) {
            blog_not_found();
        }
        $isPreview = true;
        // черновик по секретной ссылке: в индекс ему нельзя ни в каком виде
        header('X-Robots-Tag: noindex, nofollow');
    } else {
        // список «Другие сводки» внизу меняется с каждой новой записью
        blog_conditional(max((int) $post['touched_at'], blog_touched(), blog_code_mtime('zapis')));
    }

    $others = blog_published(5, 0, (int) $post['id']);
    // у черновика даты публикации ещё нет — в предпросмотре показываем «сейчас»
    $published = (int) ($post['published_at'] ?? time());
    $updated = max((int) $post['updated_at'], $published);
    $p = BlogPage::load('zapis');
    $og = $p->meta('og:image');

    $p->block('UPDATED', $updated - $published > 600)
        ->block('MORE', $others !== [])
        ->repeat('ITEM', array_map('blog_item_row', $others));

    $html = $p->render(
        [
            '__POST_SLUG__' => (string) $post['slug'],
            '__POST_TITLE__' => (string) $post['title'],
            '__POST_TITLE_TAG__' => blog_title_tag($post),
            '__POST_HEADLINE__' => blog_cut((string) $post['title'], 110),
            '__POST_DESCRIPTION__' => blog_description($post),
            '__POST_PUBLISHED_ISO__' => blog_iso($published),
            '__POST_PUBLISHED_WHEN__' => blog_when($published, true),
            '__POST_MODIFIED_ISO__' => blog_iso($updated),
            '__POST_MODIFIED_WHEN__' => blog_when($updated),
        ],
        ['__POST_BODY__' => blog_render_body((string) $post['body'], 2)],
        ['__OG_IMAGE__' => $og]
    );
    if ($isPreview) {
        $html = str_replace('<meta name="robots" content="index,', '<meta name="robots" content="noindex,', $html);
    }
    blog_send_html($html);
}

/** Ссылка предпросмотра черновика: подписана секретом, у каждой записи своя. */
function blog_preview_token(array $post): string
{
    return substr(hash_hmac('sha256', 'preview|' . $post['id'] . '|' . $post['created_at'], blog_secret()), 0, 32);
}

/**
 * Карта раздела: /granica-narva-ivangorod/sitemap.xml, объявлена в robots.txt
 * второй строкой Sitemap. Отдельно от /sitemap.xml, потому что та собирается
 * Astro при сборке и о записях из админки не знает.
 *
 * lastmod — со временем: сводки выходят по несколько в день, и одна дата на
 * все записи суток ничего бы краулеру не сказала.
 */
function blog_sitemap(): never
{
    blog_conditional(max(blog_touched(), (int) @filemtime(__FILE__)));
    $rows = blog_db()->query(
        "SELECT slug, updated_at FROM posts WHERE status = 'published' ORDER BY published_at DESC, id DESC"
    )->fetchAll();
    $hubMod = blog_touched();

    $urls = ['  <url>', '    <loc>' . BLOG_SITE . BLOG_PATH . '</loc>'];
    if ($hubMod > 0) {
        $urls[] = '    <lastmod>' . blog_iso($hubMod) . '</lastmod>';
    }
    array_push($urls, '    <changefreq>hourly</changefreq>', '    <priority>0.9</priority>', '  </url>');
    foreach ($rows as $r) {
        array_push(
            $urls,
            '  <url>',
            '    <loc>' . BLOG_SITE . BLOG_PATH . blog_e((string) $r['slug']) . '/</loc>',
            '    <lastmod>' . blog_iso((int) $r['updated_at']) . '</lastmod>',
            '    <changefreq>weekly</changefreq>',
            '    <priority>0.6</priority>',
            '  </url>'
        );
    }
    header('Content-Type: application/xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>', "\n",
        '<!-- Карта раздела «Граница Нарва — Ивангород». Собирается из базы на каждый запрос. -->', "\n",
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', "\n",
        implode("\n", $urls), "\n",
        '</urlset>', "\n";
    exit;
}

// ---------------------------------------------------------------------------
// IndexNow
// ---------------------------------------------------------------------------

function blog_is_production(): bool
{
    return strcasecmp((string) ($_SERVER['HTTP_HOST'] ?? ''), BLOG_HOST) === 0;
}

/**
 * Сообщить Bing и Яндексу об изменившихся адресах — те же три приёмника, что
 * в tools/indexnow.sh. Google в IndexNow не участвует, ему сигнал — lastmod.
 *
 * Только с боевого домена: проверка на своей машине иначе слала бы в
 * поисковики адреса, которых на сайте нет. Отправляем лишь то, что реально
 * поменялось, — повторные отправки IndexNow считает спамом.
 *
 * @param list<string> $paths
 */
function blog_indexnow(array $paths): string
{
    if (!blog_is_production()) {
        return 'IndexNow: не отправлено — это не боевой домен.';
    }
    if (!function_exists('curl_multi_init')) {
        return 'IndexNow: на сервере нет curl, не отправлено.';
    }
    $body = (string) json_encode([
        'host' => BLOG_HOST,
        'key' => BLOG_INDEXNOW_KEY,
        'keyLocation' => BLOG_SITE . '/' . BLOG_INDEXNOW_KEY . '.txt',
        'urlList' => array_values(array_unique(array_map(fn($p) => BLOG_SITE . $p, $paths))),
    ], JSON_UNESCAPED_SLASHES);

    $mh = curl_multi_init();
    $handles = [];
    foreach (['https://api.indexnow.org/IndexNow', 'https://www.bing.com/IndexNow', 'https://yandex.com/indexnow'] as $endpoint) {
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json; charset=utf-8'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_TIMEOUT => 6,
        ]);
        curl_multi_add_handle($mh, $ch);
        $handles[(string) parse_url($endpoint, PHP_URL_HOST)] = $ch;
    }
    do {
        $status = curl_multi_exec($mh, $running);
        if ($running) {
            curl_multi_select($mh, 1.0);
        }
    } while ($running && $status === CURLM_OK);

    $parts = [];
    foreach ($handles as $host => $ch) {
        // 200/202 — принято; 403 — не найден файл ключа; 429 — слишком часто
        $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $parts[] = $host . ' ' . ($code > 0 ? $code : 'нет ответа');
        curl_multi_remove_handle($mh, $ch);
    }
    curl_multi_close($mh);
    return 'IndexNow: ' . implode(', ', $parts);
}
