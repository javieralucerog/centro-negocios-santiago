<?php

declare(strict_types=1);

ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    http_response_code(405);
    header('Allow: GET');

    echo json_encode(
        ['error' => 'Método no permitido. Utiliza GET.'],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

try {
    require_once __DIR__ . '/seguridad.php';
    require_once __DIR__ . '/conexion.php';

    exigirAdministrador();

    $pdo = conectarBaseDeDatosEditor();

    // Comprueba la conexión y el acceso a la tabla, sin modificar datos.
    $pdo->query('SELECT id FROM servicios LIMIT 1');

    echo json_encode(
        [
            'message' => 'Acceso autorizado y conexión del editor correcta.',
        ],
        JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
    );
} catch (Throwable $error) {
    error_log(
        'Error en administración: ' . $error->getMessage()
    );

    http_response_code(500);

    echo json_encode(
        ['error' => 'No fue posible comprobar el acceso administrativo.'],
        JSON_UNESCAPED_UNICODE
    );
}