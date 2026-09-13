<?php

declare(strict_types=1);

ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function responder(int $status, array $data): never
{
    http_response_code($status);

    echo json_encode(
        $data,
        JSON_UNESCAPED_UNICODE
            | JSON_UNESCAPED_SLASHES
            | JSON_THROW_ON_ERROR
    );

    exit;
}

try {
    require_once __DIR__ . '/seguridad.php';
    require_once __DIR__ . '/conexion.php';

    exigirAdministrador();

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method !== 'PUT') {
        header('Allow: PUT');
        responder(405, ['error' => 'Utiliza el método PUT.']);
    }

    $contentType = strtolower(trim(explode(
        ';',
        $_SERVER['CONTENT_TYPE'] ?? ''
    )[0]));

    if ($contentType !== 'application/json') {
        responder(415, ['error' => 'Envía el contenido como JSON.']);
    }

    $rawBody = file_get_contents(
        'php://input',
        false,
        null,
        0,
        20001
    );

    if ($rawBody === false) {
        throw new RuntimeException('No se pudo leer la solicitud.');
    }

    if (strlen($rawBody) > 20000) {
        responder(413, ['error' => 'El contenido es demasiado grande.']);
    }

    try {
        $data = json_decode(
            $rawBody,
            false,
            32,
            JSON_THROW_ON_ERROR
        );
    } catch (JsonException $error) {
        responder(400, ['error' => 'El JSON no es válido.']);
    }

    if (!$data instanceof stdClass) {
        responder(400, ['error' => 'Envía un objeto JSON.']);
    }

    $data = get_object_vars($data);

    $limits = [
        'title' => 150,
        'description' => 2000,
        'detail' => 2000,
    ];

    $unknownFields = array_diff(
        array_keys($data),
        array_keys($limits)
    );

    if ($unknownFields !== []) {
        responder(422, ['error' => 'Hay campos no permitidos.']);
    }

    $errors = [];
    $clean = [];

    foreach ($limits as $field => $maxLength) {
        if (!isset($data[$field]) || !is_string($data[$field])) {
            $errors[$field] = 'Este campo debe contener texto.';
            continue;
        }

        $value = trim($data[$field]);

        if ($value === '' || mb_strlen($value, 'UTF-8') > $maxLength) {
            $errors[$field] =
                "Este campo es obligatorio y admite hasta $maxLength caracteres.";
            continue;
        }

        $clean[$field] = $value;
    }

    if ($errors !== []) {
        responder(422, [
            'error' => 'Revisa los campos enviados.',
            'fields' => $errors,
        ]);
    }

    $pdo = conectarBaseDeDatosEditor();

    $exists = $pdo->query(
        'SELECT id FROM nosotros WHERE id = 1'
    )->fetch();

    if ($exists === false) {
        responder(404, ['error' => 'No existe el contenido de Nosotros.']);
    }

    $statement = $pdo->prepare(
        'UPDATE nosotros
         SET titulo = :title,
             descripcion = :description,
             detalle = :detail
         WHERE id = 1'
    );

    $statement->execute([
        'title' => $clean['title'],
        'description' => $clean['description'],
        'detail' => $clean['detail'],
    ]);

    responder(200, [
        'message' => 'Contenido de Nosotros actualizado correctamente.',
        'data' => $clean,
    ]);
} catch (Throwable $error) {
    error_log(
        'Error al actualizar Nosotros: ' . $error->getMessage()
    );

    responder(500, [
        'error' => 'No fue posible actualizar el contenido.',
    ]);
}