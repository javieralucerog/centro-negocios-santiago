USE centro_negocios_db;

SET NAMES utf8mb4;

-- Datos de ejemplo para una instalación nueva.
-- Ejecutar después de schema.sql, con las tablas de contenido vacías.

START TRANSACTION;

INSERT INTO servicios
    (id, titulo, descripcion, imagen, orden)
VALUES
(
    'asesoria',
    'Asesoría para tu negocio',
    'Encuentra orientación para organizar tus prioridades, identificar oportunidades y planificar los próximos pasos de tu emprendimiento.',
    '/images/asesoria.jpg',
    1
),
(
    'capacitacion',
    'Capacitación empresarial',
    'Instancias de aprendizaje para fortalecer tus conocimientos y desarrollar habilidades de gestión.',
    '/images/capacitacion.jpg',
    2
),
(
    'vinculacion',
    'Vinculación empresarial',
    'Conexiones con el ecosistema emprendedor para explorar oportunidades de colaboración.',
    '/images/vinculacion.jpg',
    3
);

INSERT INTO nosotros
    (id, titulo, descripcion, detalle)
VALUES
(
    1,
    'Acompañamos el crecimiento de tu negocio.',
    'El Centro de Negocios Santiago de Sercotec acompaña a emprendedores y pequeñas empresas mediante asesoría, capacitación y vinculación con el ecosistema empresarial.',
    'Conoce las alternativas de apoyo y consulta al centro para identificar las que se ajustan a las necesidades de tu negocio.'
);

INSERT INTO preguntas
    (id, pregunta, respuesta, orden)
VALUES
(
    'apoyo',
    '¿Cómo puede ayudarme el Centro de Negocios?',
    'Puedes consultar por asesoría empresarial, capacitación y vinculación. El centro podrá orientarte sobre las alternativas que se ajustan a las necesidades de tu emprendimiento.',
    1
),
(
    'contacto',
    '¿Cómo puedo consultar por un servicio?',
    'Selecciona Contáctanos en una tarjeta de servicio. El servicio quedará seleccionado automáticamente en el formulario. En esta demostración, las consultas se guardan localmente y no se envían al centro real.',
    2
),
(
    'informacion',
    '¿Qué información debo incluir en mi consulta?',
    'En esta demostración utiliza datos ficticios. Describe brevemente un emprendimiento de ejemplo y el apoyo que necesita. No incluyas contraseñas, información bancaria ni otros datos sensibles.',
    3
);

COMMIT;