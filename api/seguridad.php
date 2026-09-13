<?php

declare(strict_types=1);

function exigirAdministrador(): void
{
    $configPath = dirname(__DIR__, 2)
        . '/centro-negocios-config/auth.php';

    if (!is_readable($configPath)) {
        throw new RuntimeException(
            'No se pudo leer la configuración de autenticación.'
        );
    }

    $config = require $configPath;
    $expectedToken = $config['admin_token'] ?? '';

    if (!is_string($expectedToken) || strlen($expectedToken) < 64) {
        throw new RuntimeException(
            'La clave de administración no está configurada correctamente.'
        );
    }

    $authorization = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';

    if ($authorization === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $name => $value) {
            if (strcasecmp($name, 'Authorization') === 0) {
                $authorization = $value;
                break;
            }
        }
    }

    $validFormat = preg_match(
        '/^Bearer ([a-f0-9]{64})$/i',
        $authorization,
        $matches
    );

    if (
        $validFormat !== 1 ||
        !hash_equals($expectedToken, $matches[1])
    ) {
        http_response_code(401);
        header('WWW-Authenticate: Bearer');

        echo json_encode(
            ['error' => 'Acceso no autorizado.'],
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }
}