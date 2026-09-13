<?php

declare(strict_types=1);

function crearConexionPDO(string $configFile): PDO
{
    $configPath = dirname(__DIR__, 2)
        . '/centro-negocios-config/'
        . $configFile;

    if (!is_readable($configPath)) {
        throw new RuntimeException(
            'No se pudo leer la configuración de la base de datos.'
        );
    }

    $config = require $configPath;

    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $config['host'],
        $config['port'],
        $config['database']
    );

    return new PDO(
        $dsn,
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
}

function conectarBaseDeDatos(): PDO
{
    return crearConexionPDO('database.php');
}

function conectarBaseDeDatosEditor(): PDO
{
    return crearConexionPDO('database-editor.php');
}