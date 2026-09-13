<?php

declare(strict_types=1);

ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Vary: Origin');

function responder(int $estado, array $datos): never
{
    http_response_code($estado);

    echo json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    exit;
}

// Permitir las solicitudes de nuestro frontend local.
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';

$origenesPermitidos = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
];

if ($origen !== '') {
    if (!in_array($origen, $origenesPermitidos, true)) {
        responder(403, ['error' => 'Origen no permitido.']);
    }

    header('Access-Control-Allow-Origin: ' . $origen);
}

$metodo = $_SERVER['REQUEST_METHOD'] ?? '';

if ($metodo === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($metodo !== 'POST') {
    header('Allow: POST, OPTIONS');
    responder(405, ['error' => 'Utiliza el método POST.']);
}

$tipoContenido = strtolower(trim(
    explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]
));

if ($tipoContenido !== 'application/json') {
    responder(415, ['error' => 'Envía el contenido como JSON.']);
}

try {
    $contenido = file_get_contents(
        'php://input',
        false,
        null,
        0,
        20001
    );

    if ($contenido === false) {
        throw new RuntimeException('No se pudo leer la solicitud.');
    }

    if (strlen($contenido) > 20000) {
        responder(413, ['error' => 'La solicitud es demasiado grande.']);
    }

    try {
        $objeto = json_decode(
            $contenido,
            false,
            32,
            JSON_THROW_ON_ERROR
        );
    } catch (JsonException $error) {
        responder(400, ['error' => 'El JSON no es válido.']);
    }

    if (!$objeto instanceof stdClass) {
        responder(400, ['error' => 'Envía un objeto JSON.']);
    }

    $datos = get_object_vars($objeto);

    $permitidos = ['name', 'email', 'service', 'message', 'website'];

    if (array_diff(array_keys($datos), $permitidos) !== []) {
        responder(422, ['error' => 'Hay campos no permitidos.']);
    }

    // Campo trampa: el formulario lo enviará vacío.
    // Es una medida básica contra bots, no una protección completa.
    if (
        !array_key_exists('website', $datos)
        || !is_string($datos['website'])
        || $datos['website'] !== ''
    ) {
        responder(422, ['error' => 'No se pudo validar el formulario.']);
    }

    $reglas = [
        'name' => [2, 80],
        'email' => [3, 120],
        'service' => [1, 50],
        'message' => [10, 1000],
    ];

    $limpios = [];
    $errores = [];

    foreach ($reglas as $campo => [$minimo, $maximo]) {
        if (
            !array_key_exists($campo, $datos)
            || !is_string($datos[$campo])
        ) {
            $errores[$campo] = 'Este campo debe contener texto.';
            continue;
        }

        $valor = trim($datos[$campo]);
        $longitud = mb_strlen($valor, 'UTF-8');

        if ($longitud < $minimo || $longitud > $maximo) {
            $errores[$campo] =
                "Debe contener entre $minimo y $maximo caracteres.";
        }

        $limpios[$campo] = $valor;
    }

    if (
        isset($limpios['email'])
        && filter_var($limpios['email'], FILTER_VALIDATE_EMAIL) === false
    ) {
        $errores['email'] = 'Ingresa un correo electrónico válido.';
    }

    if (
        isset($limpios['service'])
        && preg_match('/^[a-z0-9_-]{1,50}$/', $limpios['service']) !== 1
    ) {
        $errores['service'] = 'Selecciona un servicio válido.';
    }

    if ($errores !== []) {
        responder(422, [
            'error' => 'Revisa los campos del formulario.',
            'fields' => $errores,
        ]);
    }

    require_once __DIR__ . '/conexion.php';

    $pdo = conectarBaseDeDatosEditor();

    $consulta = $pdo->prepare(
        'SELECT id FROM servicios WHERE id = :id'
    );

    $consulta->execute(['id' => $limpios['service']]);

    if ($consulta->fetch() === false) {
        responder(422, [
            'error' => 'El servicio seleccionado ya no está disponible.',
            'fields' => [
                'service' => 'Selecciona otro servicio.',
            ],
        ]);
    }

    $insertar = $pdo->prepare(
        'INSERT INTO consultas
            (nombre, correo, servicio_id, mensaje)
         VALUES
            (:nombre, :correo, :servicio, :mensaje)'
    );

    $insertar->execute([
        'nombre' => $limpios['name'],
        'correo' => $limpios['email'],
        'servicio' => $limpios['service'],
        'mensaje' => $limpios['message'],
    ]);

    responder(201, [
        'message' => 'Consulta guardada en esta demostración local. '
            . 'No se ha enviado al centro real.',
    ]);
} catch (Throwable $error) {
    error_log('Error en contacto.php: ' . $error->getMessage());

    responder(500, [
        'error' => 'No se pudo guardar la consulta. Inténtalo más tarde.',
    ]);
}