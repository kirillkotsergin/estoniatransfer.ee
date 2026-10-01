<?php
/**
 * Фото сводок: /granica-narva-ivangorod/foto/<name>-<ширина>.webp.
 *
 * Файлы лежат вне htdocs, рядом с базой (lib.php, blog_foto_dir), поэтому
 * Apache сам их не видит и отдаёт этот скрипт. Имя у фото никогда не
 * меняется, а содержимое под ним — тоже, поэтому кеш на год с immutable:
 * повторный визит не тратит на фото ни запроса. Cache-Control для этого
 * файла снят с общего правила no-store для .php в .htaccess.
 */

declare(strict_types=1);

require dirname(__DIR__) . '/_blog/lib.php';

try {
    $ref = (string) ($_GET['f'] ?? '');
    $found = preg_match('/^[a-z0-9-]{1,100}\.webp$/', $ref) === 1 ? blog_image_lookup($ref) : null;
    if ($found === null) {
        blog_not_found();
    }
    [$img, $width] = $found;
    $file = blog_foto_dir() . '/' . $img['name'] . '-' . $width . '.webp';
    if (!is_file($file)) {
        blog_not_found();
    }

    $etag = '"' . $img['name'] . '-' . $width . '"';
    header('Cache-Control: public, max-age=31536000, immutable');
    header('ETag: ' . $etag);
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', (int) filemtime($file)) . ' GMT');
    if (trim((string) ($_SERVER['HTTP_IF_NONE_MATCH'] ?? '')) === $etag) {
        http_response_code(304);
        exit;
    }
    header('Content-Type: image/webp');
    header('Content-Length: ' . filesize($file));
    readfile($file);
} catch (Throwable $e) {
    error_log('[granica-foto] ' . $e);
    http_response_code(503);
    header('Retry-After: 600');
}
