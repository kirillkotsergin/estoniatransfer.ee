<?php
/**
 * Раздел «Граница Нарва — Ивангород»: лента, её страницы, записи и карта.
 *
 * Адреса разбирает public/.htaccess и передаёт сюда параметром:
 *   /granica-narva-ivangorod/               лента
 *   /granica-narva-ivangorod/stranica/2/    ?page=2
 *   /granica-narva-ivangorod/<slug>/        ?slug=<slug>
 *   /granica-narva-ivangorod/sitemap.xml    ?sitemap=1
 *
 * Вся логика — в ../_blog/lib.php, здесь только развилка.
 */

declare(strict_types=1);

require dirname(__DIR__) . '/_blog/lib.php';

try {
    // /granica-narva-ivangorod/index.php — дубль ленты, уводим на чистый адрес
    $path = (string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);
    if (str_ends_with($path, '/index.php')) {
        blog_redirect(BLOG_PATH);
    }

    if (isset($_GET['sitemap'])) {
        blog_sitemap();
    }
    if (isset($_GET['slug'])) {
        blog_render_post((string) $_GET['slug'], isset($_GET['preview']) ? (string) $_GET['preview'] : null);
    }
    if (isset($_GET['page'])) {
        $page = (int) $_GET['page'];
        if ($page === 1) {
            blog_redirect(BLOG_PATH); // /stranica/1/ — та же лента
        }
        blog_render_hub($page);
    }
    blog_render_hub(1);
} catch (Throwable $e) {
    error_log('[granica] ' . $e);
    // 503, а не 500: краулер придёт позже, а не вычеркнет страницу
    http_response_code(503);
    header('Retry-After: 600');
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="robots" content="noindex">',
        '<title>Временно недоступно</title><p>Сводки временно недоступны, загляните через несколько минут. ',
        '<a href="/">На главную</a></p></html>';
}
