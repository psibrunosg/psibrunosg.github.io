<?php
// Se rodando via servidor embutido do PHP, serve arquivos estáticos normalmente (CSS, JS, Imagens)
if (php_sapi_name() === 'cli-server') {
    $file = __DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (is_file($file)) {
        return false;
    }
}

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
