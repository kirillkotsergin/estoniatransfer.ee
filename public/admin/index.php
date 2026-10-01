<?php
/**
 * Админка раздела «Граница Нарва — Ивангород»: /admin/.
 *
 * Вход прошит в коде — admin / 777, константы в ../_blog/lib.php. Решение
 * владельца для первой версии (01.10.2026), владелец знает, что это
 * небезопасно. Что сделано, чтобы прошитый пароль не стал единственной
 * преградой:
 *   - сессия — cookie с подписью HMAC (секрет в базе вне htdocs), подделать
 *     её руками нельзя; живёт 7 дней;
 *   - на каждой форме CSRF-токен, производный от сессии;
 *   - после 10 неудачных входов за 15 минут с одного адреса вход закрыт;
 *   - текст записи не пропускает HTML (blog_render_body) — даже вошедший
 *     чужой не сможет поставить на сайт скрипт.
 *
 * Отдельного файла сессий нет — PHP-сессии не используются, мусора в ~/tmp
 * не будет (там его однажды уже вычищали, CLAUDE.md, раздел 1).
 */

declare(strict_types=1);

require dirname(__DIR__) . '/_blog/lib.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

const ADMIN_COOKIE = 'et_admin';
const ADMIN_TTL = 7 * 86400;
const ADMIN_MAX_FAILS = 10;
const ADMIN_FAIL_WINDOW = 900;

// ---------------------------------------------------------------------------
// Вход
// ---------------------------------------------------------------------------

function admin_https(): bool
{
    return ($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

function admin_sign(string $data): string
{
    return hash_hmac('sha256', $data, blog_secret());
}

/** Действующая сессия или null. */
function admin_session(): ?string
{
    $c = (string) ($_COOKIE[ADMIN_COOKIE] ?? '');
    if (preg_match('/^(\d{10})\.([a-f0-9]{64})$/', $c, $m) !== 1 || (int) $m[1] < time()) {
        return null;
    }
    return hash_equals(admin_sign('admin|' . $m[1]), $m[2]) ? $c : null;
}

function admin_set_cookie(string $value, int $expires): void
{
    setcookie(ADMIN_COOKIE, $value, [
        'expires' => $expires,
        'path' => '/admin/',
        'secure' => admin_https(),
        'httponly' => true,
        // Lax, а не Strict: со Strict переход по ссылке на админку из почты
        // или мессенджера открывал бы форму входа. От CSRF защищает токен.
        'samesite' => 'Lax',
    ]);
}

function admin_csrf(string $session): string
{
    return admin_sign('csrf|' . $session);
}

function admin_ip(): string
{
    return substr(hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? '')), 0, 16); // сам IP не храним
}

function admin_locked(): bool
{
    $db = blog_db();
    $db->prepare('DELETE FROM login_failures WHERE at < ?')->execute([time() - ADMIN_FAIL_WINDOW]);
    $st = $db->prepare('SELECT COUNT(*) FROM login_failures WHERE ip = ?');
    $st->execute([admin_ip()]);
    return (int) $st->fetchColumn() >= ADMIN_MAX_FAILS;
}

// ---------------------------------------------------------------------------
// Сохранение
// ---------------------------------------------------------------------------

function admin_clean_line(mixed $v): string
{
    return trim((string) preg_replace('/\s+/u', ' ', (string) $v));
}

/**
 * Создать или обновить запись.
 *
 * Слаг фиксируется в момент первой публикации и больше не меняется: адрес,
 * который ушёл в карту сайта и в IndexNow, менять нельзя — пришлось бы
 * заводить 301. До публикации он собирается из заголовка заново при каждом
 * сохранении, если не задан руками.
 *
 * updated_at двигается только от правки текста, touched_at — от любой
 * видимой снаружи перемены. Сохранение без изменений не трогает ничего:
 * lastmod, который сдвигается просто так, поисковик перестаёт уважать.
 *
 * @return array{errors: list<string>, post: array<string,mixed>, msg?: string, ping?: list<string>}
 */
function admin_save(?int $id, array $in): array
{
    $old = $id !== null ? blog_post($id) : null;
    $title = admin_clean_line($in['title'] ?? '');
    $body = trim(str_replace(["\r\n", "\r"], "\n", (string) ($in['body'] ?? '')));
    $seoTitle = admin_clean_line($in['seo_title'] ?? '');
    $seoDesc = admin_clean_line($in['seo_description'] ?? '');
    $slugIn = trim((string) ($in['slug'] ?? ''));
    $status = ($in['status'] ?? '') === 'published' ? 'published' : 'draft';

    $draft = ($old ?? ['id' => null, 'slug' => '', 'status' => 'draft', 'published_at' => null, 'created_at' => time()])
        + ['updated_at' => time()];
    $draft = array_merge($draft, [
        'title' => $title, 'body' => $body, 'seo_title' => $seoTitle,
        'seo_description' => $seoDesc, 'slug_input' => $slugIn,
    ]);

    $errors = [];
    if ($id !== null && ($old === null || $old['status'] === 'deleted')) {
        $errors[] = 'Запись не найдена — возможно, её уже удалили.';
    }
    if ($title === '') {
        $errors[] = 'Нужен заголовок.';
    } elseif (mb_strlen($title) > 200) {
        $errors[] = 'Заголовок длиннее 200 знаков — сократите.';
    }
    if ($body === '') {
        $errors[] = 'Нужен текст сводки.';
    } elseif (mb_strlen($body) > 50000) {
        $errors[] = 'Текст длиннее 50 000 знаков.';
    }
    if (mb_strlen($seoTitle) > 70) {
        $errors[] = 'Заголовок для поиска длиннее 70 знаков: Google покажет только начало.';
    }
    if (mb_strlen($seoDesc) > 200) {
        $errors[] = 'Описание для поиска длиннее 200 знаков: в выдачу попадёт не больше 160.';
    }
    if ($errors) {
        return ['errors' => $errors, 'post' => $draft];
    }

    $now = time();
    if ($old !== null && $old['published_at'] !== null) {
        $slug = (string) $old['slug'];
    } else {
        $base = blog_slugify($slugIn !== '' ? $slugIn : $title);
        if ($base === '') {
            $base = 'svodka-' . blog_time($now)->format('Y-m-d');
        }
        $slug = blog_unique_slug($base, (int) ($old['id'] ?? 0));
    }

    $contentChanged = $old === null || $old['title'] !== $title || $old['body'] !== $body
        || $old['seo_title'] !== $seoTitle || $old['seo_description'] !== $seoDesc;
    $statusChanged = $old === null || $old['status'] !== $status;
    $slugChanged = $old !== null && $old['slug'] !== $slug;
    if ($old !== null && !$contentChanged && !$statusChanged && !$slugChanged) {
        return ['errors' => [], 'post' => $old, 'msg' => 'nochange', 'ping' => []];
    }

    $publishedAt = $old['published_at'] ?? null;
    $first = $status === 'published' && $publishedAt === null;
    if ($first) {
        $publishedAt = $now;
    }
    $updatedAt = $contentChanged ? $now : (int) $old['updated_at'];
    if ($publishedAt !== null) {
        // черновик, написанный вчера и выпущенный сегодня, не может быть
        // «изменён» раньше, чем опубликован
        $updatedAt = max($updatedAt, (int) $publishedAt);
    }

    $db = blog_db();
    $values = [
        ':slug' => $slug, ':title' => $title, ':body' => $body, ':seo_title' => $seoTitle,
        ':seo_description' => $seoDesc, ':status' => $status, ':published_at' => $publishedAt,
        ':updated_at' => $updatedAt, ':touched_at' => $now,
    ];
    if ($old === null) {
        $db->prepare(
            'INSERT INTO posts (slug, title, body, seo_title, seo_description, status, created_at, published_at, updated_at, touched_at)
             VALUES (:slug, :title, :body, :seo_title, :seo_description, :status, :created_at, :published_at, :updated_at, :touched_at)'
        )->execute($values + [':created_at' => $now]);
        $id = (int) $db->lastInsertId();
    } else {
        $db->prepare(
            'UPDATE posts SET slug = :slug, title = :title, body = :body, seo_title = :seo_title,
             seo_description = :seo_description, status = :status, published_at = :published_at,
             updated_at = :updated_at, touched_at = :touched_at WHERE id = :id'
        )->execute($values + [':id' => $id]);
    }
    $post = blog_post((int) $id);

    // В IndexNow — только то, что поменялось снаружи. Лента меняется вместе
    // с любой записью: в ней последняя сводка и список.
    $wasLive = $old !== null && $old['status'] === 'published';
    $isLive = $status === 'published';
    $ping = ($isLive && (!$wasLive || $contentChanged)) || ($wasLive && !$isLive)
        ? [blog_url($post), BLOG_PATH]
        : [];
    $msg = match (true) {
        $first => 'published',
        $isLive => 'saved',
        $wasLive => 'unpublished',
        default => 'draft',
    };
    return ['errors' => [], 'post' => $post, 'msg' => $msg, 'ping' => $ping];
}

/** Удаление. Выходившая запись остаётся строкой со статусом deleted — адрес отвечает 410. */
function admin_delete(int $id): array
{
    $post = blog_post($id);
    if ($post === null || $post['status'] === 'deleted') {
        return [];
    }
    $db = blog_db();
    if ($post['published_at'] === null) {
        // наружу не выходила — следа не нужно, слаг освобождается
        $db->prepare('DELETE FROM posts WHERE id = ?')->execute([$id]);
        return [];
    }
    $db->prepare("UPDATE posts SET status = 'deleted', touched_at = ? WHERE id = ?")->execute([time(), $id]);
    return $post['status'] === 'published' ? [blog_url($post), BLOG_PATH] : [];
}

// ---------------------------------------------------------------------------
// Страницы админки
// ---------------------------------------------------------------------------

function admin_go(array $query = []): never
{
    header('Location: /admin/' . ($query ? '?' . http_build_query($query) : ''), true, 303);
    exit;
}

function admin_page(string $title, string $main, ?string $session = null): never
{
    $e = 'blog_e';
    $nav = '';
    if ($session !== null) {
        $csrf = $e(admin_csrf($session));
        $nav = <<<HTML
            <nav>
              <a href="/admin/">Все записи</a>
              <a href="/admin/?a=new">Новая сводка</a>
              <a href="{$e(BLOG_PATH)}" target="_blank" rel="noopener">Лента на сайте ↗</a>
              <form method="post" action="/admin/"><input type="hidden" name="a" value="logout"><input type="hidden" name="csrf" value="{$csrf}"><button class="link">Выйти</button></form>
            </nav>
            HTML;
    }
    header('Content-Type: text/html; charset=utf-8');
    echo <<<HTML
        <!doctype html>
        <html lang="ru">
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex, nofollow">
        <title>{$e($title)} — админка EstoniaTransfer</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <style>
          :root{--ink:#0b0b0c;--muted:#4a4f57;--dim:#686e79;--line:#e5e7eb;--surface:#f5f6f8;--brand:#ff6a00;--brand-hover:#f26100;--brand-ink:#c44a00;--ok:#13703a;--bad:#b42318}
          *{box-sizing:border-box}
          body{margin:0;font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--ink);background:var(--surface)}
          a{color:var(--brand-ink)}
          header{background:#fff;border-bottom:1px solid var(--line)}
          .wrap{max-width:62rem;margin:0 auto;padding:0 1.25rem}
          header .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75rem;min-height:4rem}
          .brand{font-weight:650;color:var(--ink);text-decoration:none}.brand span{color:var(--brand-ink)}
          nav{display:flex;flex-wrap:wrap;align-items:center;gap:1.1rem;font-size:.95rem}
          nav a{color:var(--muted);text-decoration:none}nav a:hover{color:var(--ink)}
          nav form{margin:0}
          main{padding:2rem 0 4rem}
          h1{font-size:1.6rem;line-height:1.2;margin:0 0 1.25rem;letter-spacing:-.01em}
          h2{font-size:1.1rem;margin:0 0 .75rem}
          .card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:1.25rem 1.4rem;margin-bottom:1.25rem}
          label{display:block;font-weight:600;margin:1.1rem 0 .35rem}
          label:first-child{margin-top:0}
          .hint{display:block;font-weight:400;font-size:.88rem;color:var(--dim);margin-top:.15rem}
          input[type=text],input[type=password],textarea{width:100%;font:inherit;color:inherit;padding:.65rem .8rem;border:1px solid #8b929d;border-radius:10px;background:#fff}
          textarea{resize:vertical;min-height:7rem}
          #body{min-height:18rem;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.95rem}
          input:focus,textarea:focus{outline:3px solid var(--ink);outline-offset:1px}
          input[readonly]{background:var(--surface);color:var(--muted)}
          .count{display:block;font-size:.82rem;color:var(--dim);margin-top:.3rem}.count.bad{color:var(--bad);font-weight:600}
          .row{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;margin-top:1.5rem}
          button,.btn{font:inherit;font-weight:600;border:0;border-radius:12px;padding:.7rem 1.2rem;cursor:pointer;background:var(--brand);color:var(--ink);text-decoration:none;display:inline-block}
          button:hover,.btn:hover{background:var(--brand-hover)}
          button.ghost,.btn.ghost{background:#fff;border:1px solid #8b929d}button.ghost:hover,.btn.ghost:hover{background:var(--surface)}
          button.link{background:none;padding:0;color:var(--muted);font-weight:400}button.link:hover{color:var(--ink);background:none}
          button.danger{background:#fff;color:var(--bad);border:1px solid #f1b5ae;padding:.35rem .7rem;font-size:.88rem}
          .msg{border-radius:12px;padding:.8rem 1rem;margin-bottom:1.25rem;background:#e9f7ef;color:var(--ok);border:1px solid #b7e2c6}
          .msg.err{background:#fdecea;color:var(--bad);border-color:#f5c2bc}.msg ul{margin:.3rem 0 0;padding-left:1.2rem}
          .msg.info{background:#fff;color:var(--muted);border-color:var(--line);font-size:.92rem}
          table{width:100%;border-collapse:collapse;font-size:.95rem}
          th{text-align:left;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;color:var(--dim);padding:.5rem .6rem;border-bottom:1px solid var(--line)}
          td{padding:.7rem .6rem;border-bottom:1px solid var(--line);vertical-align:top}
          td.nowrap{white-space:nowrap;color:var(--muted)}
          td form{display:inline;margin:0}
          .badge{display:inline-block;font-size:.78rem;font-weight:600;border-radius:999px;padding:.1rem .55rem;background:var(--surface);color:var(--muted)}
          .badge.live{background:#e9f7ef;color:var(--ok)}
          .serp{font-family:Arial,sans-serif}
          .serp .t{color:#1a0dab;font-size:1.2rem;line-height:1.3}.serp .u{color:#006621;font-size:.88rem;word-break:break-all}.serp .d{color:#4d5156;font-size:.92rem}
          .serp small{color:var(--dim)}
          .help{font-size:.9rem;color:var(--muted)}.help code{background:var(--surface);border-radius:6px;padding:.05rem .35rem}
          .grid{display:grid;gap:1.25rem}@media(min-width:900px){.grid{grid-template-columns:minmax(0,1fr) 19rem}}
          .radios label{display:inline-flex;align-items:center;gap:.4rem;font-weight:400;margin:0 1.2rem 0 0}
          .empty{color:var(--muted)}
        </style>
        </head>
        <body>
        <header><div class="wrap"><a class="brand" href="/admin/">Estonia<span>Transfer</span> · сводки с границы</a>{$nav}</div></header>
        <main><div class="wrap">{$main}</div></main>
        <script>
          // Счётчики знаков у полей с data-max. Тот же предел, что проверяет сервер
          // и сборка сайта (CLAUDE.md, 5.3): title до 60, description 140–160.
          document.querySelectorAll('[data-max]').forEach(function (el) {
            var out = document.getElementById(el.id + '-count');
            if (!out) return;
            var min = +el.getAttribute('data-min') || 0, max = +el.getAttribute('data-max');
            var empty = out.textContent;
            function update() {
              var n = el.value.trim().length;
              out.textContent = n ? n + ' знаков · нужно ' + (min ? min + '–' + max : 'до ' + max) : empty;
              out.className = 'count' + (n && (n > max || n < min) ? ' bad' : '');
            }
            el.addEventListener('input', update);
            update();
          });
        </script>
        </body>
        </html>
        HTML;
    exit;
}

function admin_login_page(string $error = ''): never
{
    $err = $error !== '' ? '<div class="msg err">' . blog_e($error) . '</div>' : '';
    admin_page('Вход', <<<HTML
        <div style="max-width:24rem;margin:3rem auto 0">
          <h1>Вход</h1>
          {$err}
          <form class="card" method="post" action="/admin/">
            <input type="hidden" name="a" value="login">
            <label for="user">Логин</label>
            <input type="text" id="user" name="user" autocomplete="username" required autofocus>
            <label for="pass">Пароль</label>
            <input type="password" id="pass" name="pass" autocomplete="current-password" required>
            <div class="row"><button>Войти</button></div>
          </form>
        </div>
        HTML);
}

function admin_messages(): string
{
    $out = '';
    $texts = [
        'published' => 'Опубликовано — сводка уже на сайте и в карте раздела.',
        'saved' => 'Сохранено.',
        'draft' => 'Сохранено как черновик — на сайте записи нет.',
        'unpublished' => 'Снято с публикации: адрес отвечает 404, из карты раздела запись убрана.',
        'nochange' => 'Изменений нет — сохранять было нечего.',
        'deleted' => 'Удалено. Если запись выходила, её адрес отвечает 410 «удалено» — поисковики уберут её из выдачи.',
    ];
    $msg = (string) ($_GET['msg'] ?? '');
    if (isset($texts[$msg])) {
        $out .= '<div class="msg">' . blog_e($texts[$msg]) . '</div>';
    }
    if (isset($_GET['n']) && $_GET['n'] !== '') {
        $out .= '<div class="msg info">' . blog_e(mb_substr((string) $_GET['n'], 0, 200)) . '</div>';
    }
    return $out;
}

function admin_list_page(string $session): never
{
    $e = 'blog_e';
    $csrf = $e(admin_csrf($session));
    $rows = blog_db()->query(
        "SELECT * FROM posts WHERE status != 'deleted' ORDER BY COALESCE(published_at, created_at) DESC, id DESC"
    )->fetchAll();

    $trs = '';
    foreach ($rows as $p) {
        $live = $p['status'] === 'published';
        $badge = $live ? '<span class="badge live">на сайте</span>' : '<span class="badge">черновик</span>';
        $when = $p['published_at'] !== null ? blog_when((int) $p['published_at']) : '—';
        $edited = blog_when((int) $p['updated_at']);
        $view = $live
            ? '<a href="' . $e(blog_url($p)) . '" target="_blank" rel="noopener">открыть ↗</a>'
            : '<a href="' . $e(blog_url($p) . '?preview=' . blog_preview_token($p)) . '" target="_blank" rel="noopener">предпросмотр ↗</a>';
        $trs .= <<<HTML
            <tr>
              <td><a href="/admin/?a=edit&amp;id={$p['id']}"><strong>{$e($p['title'])}</strong></a><br><small style="color:var(--dim)">{$e(blog_url($p))}</small></td>
              <td>{$badge}</td>
              <td class="nowrap">{$e($when)}</td>
              <td class="nowrap">{$e($edited)}</td>
              <td class="nowrap">{$view}
                <form method="post" action="/admin/" onsubmit="return confirm('Удалить «' + this.dataset.t + '»?')" data-t="{$e($p['title'])}">
                  <input type="hidden" name="a" value="delete"><input type="hidden" name="id" value="{$p['id']}"><input type="hidden" name="csrf" value="{$csrf}">
                  <button class="danger">Удалить</button>
                </form>
              </td>
            </tr>
            HTML;
    }
    $table = $rows
        ? "<table><thead><tr><th>Запись</th><th>Статус</th><th>Опубликовано</th><th>Изменено</th><th></th></tr></thead><tbody>{$trs}</tbody></table>"
        : '<p class="empty">Записей пока нет. Первая сводка — кнопкой «Новая сводка».</p>';
    $count = count($rows);
    $sitemap = $e(BLOG_PATH . 'sitemap.xml');

    admin_page('Записи', admin_messages() . <<<HTML
        <div class="row" style="justify-content:space-between;margin:0 0 1.25rem">
          <h1 style="margin:0">Сводки об очереди · {$count}</h1>
          <a class="btn" href="/admin/?a=new">Новая сводка</a>
        </div>
        <div class="card">{$table}</div>
        <p class="help">Карта раздела для поисковиков: <a href="{$sitemap}" target="_blank" rel="noopener">{$sitemap}</a> — обновляется сама.</p>
        HTML, $session);
}

/** @param list<string> $errors */
function admin_edit_page(string $session, array $post, array $errors = []): never
{
    $e = 'blog_e';
    $csrf = $e(admin_csrf($session));
    $id = $post['id'] ?? null;
    $isNew = $id === null;
    $live = $post['status'] === 'published';
    $locked = !$isNew && ($post['published_at'] ?? null) !== null;

    // Поле адреса у черновика пустое, если слаг собран из заголовка: тогда
    // при смене заголовка поменяется и он. Заданный руками — остаётся.
    $slugValue = $post['slug_input'] ?? (!$isNew && $post['slug'] !== blog_slugify((string) $post['title']) ? (string) $post['slug'] : '');
    $slugField = $locked
        ? '<input type="text" id="slug" value="' . $e($post['slug']) . '" readonly><span class="hint">Адрес закреплён при первой публикации: он уже в карте сайта и у поисковиков.</span>'
        : '<input type="text" id="slug" name="slug" value="' . $e($slugValue) . '" placeholder="' . $e($isNew ? 'соберётся из заголовка' : (string) $post['slug']) . '" pattern="[a-z0-9\-]*" title="латиница, цифры и дефис"><span class="hint">Пусто — соберём из заголовка латиницей. Закрепится при публикации.</span>';

    $err = $errors ? '<div class="msg err">Не сохранено:<ul><li>' . implode('</li><li>', array_map($e, $errors)) . '</li></ul></div>' : '';

    $buttons = $live
        ? '<button name="status" value="published">Сохранить</button><button class="ghost" name="status" value="draft">Снять с публикации</button>'
        : '<button name="status" value="published">Опубликовать</button><button class="ghost" name="status" value="draft">Сохранить черновик</button>';

    // Как запись увидит поисковик — теми же функциями, что строят страницу
    $serp = '';
    if (!$isNew && !$errors) {
        $tt = blog_title_tag($post);
        $dd = blog_description($post);
        $tn = mb_strlen($tt);
        $dn = mb_strlen($dd);
        $link = $live
            ? '<a href="' . $e(blog_url($post)) . '" target="_blank" rel="noopener">Открыть на сайте ↗</a>'
            : '<a href="' . $e(blog_url($post) . '?preview=' . blog_preview_token($post)) . '" target="_blank" rel="noopener">Предпросмотр черновика ↗</a>';
        $tWarn = $tn > 60 ? ' — длиннее 60, Google обрежет' : '';
        $dWarn = $dn < 140 || $dn > 160 ? ' — лучше 140–160' : '';
        $serp = <<<HTML
            <div class="card serp">
              <h2 style="font-family:inherit">Как увидит поисковик</h2>
              <div class="u">{$e(BLOG_SITE . blog_url($post))}</div>
              <div class="t">{$e($tt)}</div>
              <div class="d">{$e($dd)}</div>
              <p><small>title {$tn} знаков{$tWarn} · description {$dn} знаков{$dWarn}</small></p>
              <p style="margin-bottom:0">{$link}</p>
            </div>
            HTML;
    }

    $heading = $isNew ? 'Новая сводка' : 'Правка сводки';
    $idField = $isNew ? '' : '<input type="hidden" name="id" value="' . (int) $id . '">';

    admin_page($heading, admin_messages() . $err . <<<HTML
        <h1>{$heading}</h1>
        <div class="grid">
          <form class="card" method="post" action="/admin/">
            <input type="hidden" name="a" value="save">{$idField}
            <input type="hidden" name="csrf" value="{$csrf}">

            <label for="title">Заголовок <span class="hint">Это H1 страницы. Время и место впереди: «Очередь в Ивангороде 1 октября, 14:00: около 200 человек».</span></label>
            <input type="text" id="title" name="title" value="{$e($post['title'] ?? '')}" required maxlength="200" data-max="60">
            <span class="count" id="title-count">до 60 знаков — тогда влезет в выдачу целиком</span>

            <label for="body">Текст сводки</label>
            <textarea id="body" name="body" required>{$e($post['body'] ?? '')}</textarea>

            <label for="seo_description">Описание для поиска <span class="hint">Необязательно. Пусто — соберём из первых фраз текста.</span></label>
            <textarea id="seo_description" name="seo_description" rows="3" data-min="140" data-max="160">{$e($post['seo_description'] ?? '')}</textarea>
            <span class="count" id="seo_description-count">пусто — соберётся из текста</span>

            <label for="seo_title">Заголовок для поиска <span class="hint">Необязательно. Пусто — возьмём заголовок и допишем города, если их там нет.</span></label>
            <input type="text" id="seo_title" name="seo_title" value="{$e($post['seo_title'] ?? '')}" data-max="60">
            <span class="count" id="seo_title-count">пусто — соберётся из заголовка</span>

            <label for="slug">Адрес страницы</label>
            {$slugField}

            <div class="row">{$buttons}</div>
          </form>

          <aside>
            {$serp}
            <div class="card help">
              <h2>Как оформлять текст</h2>
              <p>Пустая строка — новый абзац.</p>
              <p><code>## Подзаголовок</code><br><code>### Подзаголовок поменьше</code></p>
              <p><code>- пункт списка</code><br><code>1. пункт по порядку</code></p>
              <p><code>**жирный**</code></p>
              <p><code>[текст ссылки](https://politsei.ee)</code><br>или на страницу сайта: <code>[трансфер](/transfer-tallinn-narva/)</code></p>
              <p style="margin-bottom:0">HTML не работает — он покажется как текст.</p>
            </div>
          </aside>
        </div>
        HTML, $session);
}

// ---------------------------------------------------------------------------
// Развилка
// ---------------------------------------------------------------------------

try {
    $isPost = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
    $action = (string) ($isPost ? ($_POST['a'] ?? '') : ($_GET['a'] ?? ''));

    if ($isPost && $action === 'login') {
        if (admin_locked()) {
            admin_login_page('Слишком много неудачных попыток. Подождите 15 минут.');
        }
        $ok = hash_equals(BLOG_ADMIN_USER, (string) ($_POST['user'] ?? ''))
            & hash_equals(BLOG_ADMIN_PASS, (string) ($_POST['pass'] ?? ''));
        if ($ok) {
            blog_db()->prepare('DELETE FROM login_failures WHERE ip = ?')->execute([admin_ip()]);
            $exp = time() + ADMIN_TTL;
            admin_set_cookie($exp . '.' . admin_sign('admin|' . $exp), $exp);
            admin_go();
        }
        blog_db()->prepare('INSERT INTO login_failures (ip, at) VALUES (?, ?)')->execute([admin_ip(), time()]);
        usleep(400_000);
        admin_login_page('Неверный логин или пароль.');
    }

    $session = admin_session();
    if ($session === null) {
        admin_login_page();
    }

    if ($isPost) {
        if (!hash_equals(admin_csrf($session), (string) ($_POST['csrf'] ?? ''))) {
            http_response_code(400);
            admin_page('Ошибка', '<div class="msg err">Форма устарела — откройте страницу заново и повторите.</div>', $session);
        }
        if ($action === 'logout') {
            admin_set_cookie('', time() - 3600);
            admin_go();
        }
        if ($action === 'delete') {
            $ping = admin_delete((int) ($_POST['id'] ?? 0));
            admin_go(['msg' => 'deleted', 'n' => $ping ? blog_indexnow($ping) : '']);
        }
        if ($action === 'save') {
            $id = isset($_POST['id']) ? (int) $_POST['id'] : null;
            $res = admin_save($id, $_POST);
            if ($res['errors']) {
                admin_edit_page($session, $res['post'], $res['errors']);
            }
            admin_go([
                'a' => 'edit',
                'id' => $res['post']['id'],
                'msg' => $res['msg'],
                'n' => $res['ping'] ? blog_indexnow($res['ping']) : '',
            ]);
        }
        admin_go();
    }

    if ($action === 'new') {
        admin_edit_page($session, ['id' => null, 'title' => '', 'body' => '', 'seo_title' => '', 'seo_description' => '', 'slug' => '', 'status' => 'draft', 'published_at' => null]);
    }
    if ($action === 'edit') {
        $post = blog_post((int) ($_GET['id'] ?? 0));
        if ($post === null || $post['status'] === 'deleted') {
            admin_go();
        }
        admin_edit_page($session, $post);
    }
    admin_list_page($session);
} catch (Throwable $e) {
    error_log('[granica-admin] ' . $e);
    http_response_code(500);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><title>Ошибка</title><p>Что-то пошло не так: ', blog_e($e->getMessage()), '</p><p><a href="/admin/">Назад</a></p>';
}
