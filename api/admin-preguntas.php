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

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'PUT') {
        header('Allow: PUT');
        responder(405, ['error' => 'Utiliza el método PUT.']);
    }

    $id = $_GET['id'] ?? '';

    if (
        !is_string($id) ||
        preg_match('/^[a-z0-9_-]{1,50}$/', $id) !== 1
    ) {
        responder(400, ['error' => 'Indica un identificador válido.']);
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

    $allowedFields = ['question', 'answer', 'order'];

    if (array_diff(array_keys($data), $allowedFields) !== []) {
        responder(422, ['error' => 'Hay campos no permitidos.']);
    }

    $limits = [
        'question' => 255,
        'answer' => 3000,
    ];

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

    if (
        !isset($data['order']) ||
        !is_int($data['order']) ||
        $data['order'] < 0 ||
        $data['order'] > 10000
    ) {
        $errors['order'] = 'Indica un entero entre 0 y 10000.';
    }

    if ($errors !== []) {
        responder(422, [
            'error' => 'Revisa los campos enviados.',
            'fields' => $errors,
        ]);
    }

    $clean['order'] = $data['order'];

    $pdo = conectarBaseDeDatosEditor();

    $check = $pdo->prepare(
        'SELECT id FROM preguntas WHERE id = :id'
    );
    $check->execute(['id' => $id]);

    if ($check->fetch() === false) {
        responder(404, ['error' => 'La pregunta no existe.']);
    }

    $statement = $pdo->prepare(
        'UPDATE preguntas
         SET pregunta = :question,
             respuesta = :answer,
             orden = :position
         WHERE id = :id'
    );

    $statement->execute([
        'question' => $clean['question'],
        'answer' => $clean['answer'],
        'position' => $clean['order'],
        'id' => $id,
    ]);

    responder(200, [
        'message' => 'Pregunta actualizada correctamente.',
        'data' => array_merge(['id' => $id], $clean),
    ]);
} catch (Throwable $error) {
    error_log(
        'Error al actualizar pregunta: ' . $error->getMessage()
    );

    responder(500, [
        'error' => 'No fue posible actualizar la pregunta.',
    ]);
}