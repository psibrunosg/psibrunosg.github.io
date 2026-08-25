<?php
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

ob_start();

switch ($path) {
    case '/':
    case '':
        require __DIR__ . '/../views/home.php';
        break;
    case '/neuroatlas':
        require __DIR__ . '/../views/neuroatlas.php';
        break;
    default:
        http_response_code(404);
        require __DIR__ . '/../views/404.php';
        break;
}

$content = ob_get_clean();
require __DIR__ . '/../views/layout.php';
