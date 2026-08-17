<?php
/**
 * Приём заявки с формы и отправка на info@estoniatransfer.ee.
 *
 * Почему PHP: на хостинге zone.ee нет способа держать Node-процесс, а PHP 8.3
 * есть из коробки. Ничего не хранится в базе — заявка сразу уходит письмом,
 * поэтому и персональные данные на сервере не остаются.
 *
 * Форма работает в двух режимах:
 *   - с JS: fetch, ответ JSON, страница не перезагружается;
 *   - без JS: обычный POST, в ответ приходит короткая страница с подтверждением.
 *
 * Защита: honeypot-поле, ограничение по числу заявок с одного адреса и
 * вырезание переводов строк из всего, что попадает в заголовки письма.
 */

declare(strict_types=1);

const MAIL_TO = 'info@estoniatransfer.ee';
const MAIL_FROM = 'noreply@estoniatransfer.ee'; // адрес домена: так проходит SPF
const RATE_LIMIT = 5;      // заявок с одного IP
const RATE_WINDOW = 3600;  // за час

/** Файл счётчика — на уровень выше htdocs, иначе деплой его удалит. */
const RATE_FILE = __DIR__ . '/../form-rate.json';

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(int $code, string $message, bool $ok = false): never
{
    global $wantsJson;
    http_response_code($code);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }
    header('Content-Type: text/html; charset=utf-8');
    $safe = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo <<<HTML
        <!doctype html><html lang="ru"><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="robots" content="noindex"><title>EstoniaTransfer</title>
        <style>body{margin:0;min-height:100vh;display:grid;place-items:center;
        font:17px/1.6 system-ui,sans-serif;color:#0b0b0c;background:#fff;padding:24px}
        .c{max-width:30rem;text-align:center}a{color:#c44a00}</style></head>
        <body><div class="c"><p>{$safe}</p><p><a href="/">← estoniatransfer.ee</a></p></div></body></html>
        HTML;
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, 'Метод не поддерживается.');
}

/** Убираем переводы строк: иначе через поле можно дописать свой заголовок. */
function clean(string $v, int $max = 200): string
{
    $v = str_replace(["\r", "\n", "\0"], ' ', $v);
    $v = trim(preg_replace('/\s+/u', ' ', $v) ?? '');
    return mb_substr($v, 0, $max);
}

// Honeypot: поле скрыто от человека, боты его заполняют. Отвечаем «успех»,
// чтобы бот не подбирал обход, но письмо не отправляем.
if (clean($_POST['company'] ?? '') !== '') {
    respond(200, 'Заявка принята.', true);
}

$from  = clean($_POST['from'] ?? '', 40);
$to    = clean($_POST['to'] ?? '', 40);
$date  = clean($_POST['date'] ?? '', 20);
$pax   = clean($_POST['pax'] ?? '', 4);
$name  = clean($_POST['name'] ?? '', 80);
$phone = clean($_POST['phone'] ?? '', 40);
$email = clean($_POST['email'] ?? '', 120);
$lang  = clean($_POST['lang'] ?? 'ru', 5);

// Список городов продублирован в src/i18n/ui.ts (cities). Расходиться им нельзя:
// форма отдаст id, которого здесь нет, и заявка вернётся с 422.
$allowedCities = ['tallinn', 'tartu', 'narva', 'koidula', 'luhamaa'];
$cityNames = [
    'tallinn' => 'Таллинн',
    'tartu' => 'Тарту',
    'narva' => 'Нарва',
    'koidula' => 'Койдула',
    'luhamaa' => 'Лухамаа',
];

$errors = [];
if (!in_array($from, $allowedCities, true)) $errors[] = 'откуда';
if (!in_array($to, $allowedCities, true)) $errors[] = 'куда';
if ($from === $to) $errors[] = 'города совпадают';
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $errors[] = 'дата';
if (!ctype_digit($pax) || (int) $pax < 1 || (int) $pax > 4) $errors[] = 'пассажиры';
if (mb_strlen($name) < 2) $errors[] = 'имя';
if (preg_match_all('/\d/', $phone) < 7) $errors[] = 'телефон';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'почта';

if ($errors) {
    respond(422, 'Проверьте поля: ' . implode(', ', $errors) . '.');
}

// ---------- ограничение частоты ----------

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$key = substr(hash('sha256', $ip), 0, 16); // сам IP не храним
$now = time();

$fh = @fopen(RATE_FILE, 'c+');
if ($fh !== false) {
    flock($fh, LOCK_EX);
    $raw = stream_get_contents($fh);
    $state = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];
    if (!is_array($state)) $state = [];
    // чистим всё старше окна
    foreach ($state as $k => $times) {
        $state[$k] = array_values(array_filter((array) $times, fn($t) => $now - (int) $t < RATE_WINDOW));
        if (!$state[$k]) unset($state[$k]);
    }
    $mine = $state[$key] ?? [];
    if (count($mine) >= RATE_LIMIT) {
        flock($fh, LOCK_UN);
        fclose($fh);
        respond(429, 'Слишком много заявок за короткое время. Напишите нам в WhatsApp.');
    }
    $mine[] = $now;
    $state[$key] = $mine;
    rewind($fh);
    ftruncate($fh, 0);
    fwrite($fh, (string) json_encode($state));
    flock($fh, LOCK_UN);
    fclose($fh);
}

// ---------- письмо ----------

$route = ($cityNames[$from] ?? $from) . ' → ' . ($cityNames[$to] ?? $to);
$subject = 'Заявка: ' . $route . ', ' . $date;

$body = implode("\n", [
    'Новая заявка с сайта estoniatransfer.ee',
    '',
    'Маршрут:     ' . $route,
    'Дата:        ' . $date,
    'Пассажиров:  ' . $pax,
    'Имя:         ' . $name,
    'Телефон:     ' . $phone,
    'Почта:       ' . ($email !== '' ? $email : '—'),
    '',
    'Язык страницы: ' . $lang,
    'Отправлено:    ' . gmdate('Y-m-d H:i') . ' UTC',
]);

$headers = [
    'From: EstoniaTransfer <' . MAIL_FROM . '>',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
    'MIME-Version: 1.0',
    'X-Mailer: estoniatransfer-form',
];
// Ответить клиенту можно прямо из письма, если он оставил почту
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

// Тема в UTF-8 кодируется base64, иначе в почтовых клиентах получится мусор
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$sent = @mail(MAIL_TO, $encodedSubject, $body, implode("\r\n", $headers), '-f' . MAIL_FROM);

if (!$sent) {
    respond(500, 'Не удалось отправить заявку. Напишите нам в WhatsApp — ответим сразу.');
}

respond(200, $lang === 'en'
    ? 'Thank you! The request has been sent, we will get back to you shortly.'
    : 'Спасибо! Заявка отправлена, скоро свяжемся.', true);
