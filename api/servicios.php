<?php

declare(strict_types=1);

ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Vary: Origin');

$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method !== 'GET') {
    http_response_code(405);
    header('Allow: GET');

    echo json_encode(
        ['error' => 'Método no permitido. Utiliza GET.'],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

try {
    require_once __DIR__ . '/conexion.php';

    $pdo = conectarBaseDeDatos();

    $query = $pdo->query(
        'SELECT
            id,
            titulo AS title,
            descripcion AS description,
            imagen AS image
         FROM servicios
         ORDER BY orden ASC, id ASC'
    );

    $services = $query->fetchAll();

    $json = json_encode(
        $services,
        JSON_UNESCAPED_UNICODE
            | JSON_UNESCAPED_SLASHES
            | JSON_PRETTY_PRINT
            | JSON_THROW_ON_ERROR
    );

    http_response_code(200);
    echo $json;
} catch (Throwable $error) {
    error_log(
        'Error al consultar servicios: ' . $error->getMessage()
    );

    http_response_code(500);

    echo json_encode(
        ['error' => 'No fue posible cargar los servicios.'],
        JSON_UNESCAPED_UNICODE
    );
}