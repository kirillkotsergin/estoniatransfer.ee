<?php
/**
 * Счётчик посещений EstoniaTransfer.
 *
 * Считает уникальных посетителей за сутки и НЕ ставит cookie: посетителя
 * различаем по хешу «соль + IP + строка браузера», сам IP никуда не пишется.
 * Поэтому баннер согласия сайту не нужен.
 *
 * Дёргает этот файл встроенный скрипт в подвале через fetch — значит боты,
 * которые не исполняют JS, сюда вообще не доходят; остальных отсекаем по
 * User-Agent.
 *
 * Файл с данными лежит ВНЕ htdocs, на уровень выше. Это важно: выкладка
 * синхронизирует htdocs (а rsync в workflow — ещё и с --delete), и счётчик
 * внутри htdocs обнулялся бы при каждом деплое. Каталог
 * www.estoniatransfer.ee/ доступен на запись — проверено 17.08.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

/** Отдать JSON и закончить работу. */
function respond(array $data): void
{
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

$store = dirname(__DIR__) . '/hits.json';

// Пустой User-Agent тоже считаем ботом: у настоящих браузеров он всегда есть.
$agent = isset($_SERVER['HTTP_USER_AGENT']) ? (string) $_SERVER['HTTP_USER_AGENT'] : '';
$isBot = $agent === '' || preg_match(
    '~bot|crawl|spider|slurp|search|preview|monitor|curl|wget|python|java/|headless|lighthouse|pingdom|uptime|scan~i',
    $agent
) === 1;

// 'c+' создаёт файл, если его ещё нет, и не обрезает существующий.
$handle = @fopen($store, 'c+');
if ($handle === false) {
    // Нет доступа на запись — счётчик молчит, страница от этого не ломается.
    respond(['error' => 'store']);
}

flock($handle, LOCK_EX);

$raw = stream_get_contents($handle);
$state = is_string($raw) && $raw !== '' ? json_decode($raw, true) : null;
if (!is_array($state)) {
    $state = [];
}

// Соль генерируем при первом запуске и держим только на сервере: репозиторий
// публичный, а с известной солью хеш посетителя можно пересчитать обратно.
if (empty($state['salt']) || !is_string($state['salt'])) {
    $state['salt'] = bin2hex(random_bytes(16));
}

$total = isset($state['total']) ? (int) $state['total'] : 0;
$today = isset($state['today']) ? (int) $state['today'] : 0;
$day = isset($state['day']) ? (string) $state['day'] : '';
$seen = isset($state['seen']) && is_array($state['seen']) ? $state['seen'] : [];

$now = gmdate('Y-m-d');
if ($day !== $now) {
    // Начались новые сутки — список посетителей заводим заново.
    $day = $now;
    $today = 0;
    $seen = [];
}

if (!$isBot) {
    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    $mark = substr(hash('sha256', $state['salt'] . '|' . $ip . '|' . $agent), 0, 16);

    if (!in_array($mark, $seen, true)) {
        // Страховка от разрастания файла: столько людей за сутки не приходит,
        // но если предел всё же достигнут — посещение считаем, не запоминая.
        if (count($seen) < 5000) {
            $seen[] = $mark;
        }
        $total++;
        $today++;
    }
}

$state['total'] = $total;
$state['today'] = $today;
$state['day'] = $day;
$state['seen'] = $seen;

rewind($handle);
ftruncate($handle, 0);
fwrite($handle, (string) json_encode($state, JSON_UNESCAPED_UNICODE));
fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);

respond(['total' => $total, 'today' => $today]);
