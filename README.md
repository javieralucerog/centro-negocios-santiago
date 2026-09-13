# Centro de Negocios Santiago

Proyecto académico de una página web para un Centro de Negocios,
desarrollado con React, Vite, Bootstrap, PHP y MySQL.

Esta propuesta no corresponde al sitio oficial de Sercotec.
Las consultas se guardan en la base de datos local y no se envían
al centro real.

## Funcionalidades

- Navegación adaptable a dispositivos móviles.
- Tarjetas de servicios con selección automática en el formulario.
- Sección Nosotros y preguntas frecuentes obtenidas desde una API.
- Carrusel de testimonios ficticios identificados como ejemplos.
- Formulario con validación en el navegador y en PHP.
- Guardado de consultas mediante consultas preparadas.
- Campo trampa como protección básica contra bots.
- Edición de contenidos mediante endpoints protegidos y Postman.
- Estados de carga, confirmación y error.

## Tecnologías

- React y Vite.
- Bootstrap y CSS.
- PHP con PDO.
- MySQL.
- MAMP para el servidor local.
- Postman para probar la API.
- Git y GitHub para el control de versiones.

## Estructura principal

- `src/components/`: componentes de la interfaz.
- `src/services/api.js`: consultas a la API de contenidos.
- `src/App.jsx`: composición de la página y selección del servicio.
- `src/index.css`: estilos del sitio.
- `public/images/`: imágenes de los servicios.
- `api/`: código PHP y configuración de Apache para la API.
- `index.html`: documento HTML principal.

## Requisitos del entorno local

El proyecto se ha utilizado con:

- Node.js 24 y npm 11.
- PHP 8.3 con las extensiones PDO MySQL y mbstring.
- MySQL 8.
- MAMP en macOS.

Puertos utilizados:

| Servicio | Dirección |
| --- | --- |
| Frontend | http://localhost:5173 |
| API PHP | http://127.0.0.1:8888/centro-negocios-api |
| MySQL | 127.0.0.1:8889 |

## Instalación del frontend

Clonar el repositorio:

```bash
git clone https://github.com/javieralucerog/centro-negocios-santiago.git
cd centro-negocios-santiago
```

Instalar las dependencias:

```bash
npm ci
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir la dirección que indique Vite. La API permite los orígenes
`http://localhost:5173` y `http://127.0.0.1:5173`.

Si Vite utiliza otro puerto, será necesario ajustar los orígenes
permitidos en PHP o liberar el puerto 5173.

## Instalación de la API en MAMP

1. Iniciar Apache y MySQL en MAMP.
2. Crear la carpeta:
   `/Applications/MAMP/htdocs/centro-negocios-api`.
3. Copiar allí el contenido de `api/`, incluyendo `.htaccess`.
4. Configurar Apache en el puerto 8888 y MySQL en el puerto 8889.
5. Preparar la base de datos y los archivos privados indicados abajo.

La copia de `api/` en este repositorio se utiliza para entregar
el código. Durante el desarrollo, MAMP ejecuta la copia ubicada
en `htdocs`.

Cuando se modifique la API, ambas copias deben mantenerse actualizadas.

## Base de datos y configuración privada

La base de datos se llama `centro_negocios_db` y contiene:

- `servicios`
- `nosotros`
- `preguntas`
- `consultas`

Los archivos privados se ubican fuera de la carpeta pública:

```text
/Applications/MAMP/centro-negocios-config/
```

Archivos necesarios:

| Archivo | Propósito |
| --- | --- |
| `database.php` | Conexión del usuario lector |
| `database-editor.php` | Conexión del usuario editor |
| `auth.php` | Token para los endpoints administrativos |

Los archivos de conexión devuelven un arreglo PHP con las claves
`host`, `port`, `database`, `username` y `password`.

El archivo `auth.php` devuelve un arreglo con la clave `admin_token`.
El token utilizado por la API debe tener 64 caracteres hexadecimales.

Los usuarios de MySQL se configuran para el host `127.0.0.1`:

- `centro_lector`: permiso SELECT sobre la base de datos.
- `centro_editor`: SELECT, INSERT, UPDATE y DELETE sobre servicios
  y preguntas; SELECT y UPDATE sobre nosotros; INSERT sobre consultas.

Las contraseñas y el token deben configurarse localmente.
No deben añadirse al repositorio ni al código React.

### Preparar una instalación nueva

1. Iniciar Apache y MySQL en MAMP.
2. Abrir phpMyAdmin e importar `database/schema.sql`.
3. Importar `database/seed.sql` una sola vez, con las tablas
   de contenido vacías.

El archivo `seed.sql` incluye servicios, Nosotros y preguntas
frecuentes de ejemplo. No incluye consultas de usuarios.

### Crear los usuarios de MySQL

Desde phpMyAdmin, con una cuenta administradora, ejecutar el
siguiente SQL después de reemplazar los dos valores de contraseña.

Este bloque está pensado para una instalación nueva, donde los
usuarios todavía no existen.

```sql
CREATE USER 'centro_lector'@'127.0.0.1'
IDENTIFIED BY 'REEMPLAZAR_CON_PASSWORD_LECTOR';

CREATE USER 'centro_editor'@'127.0.0.1'
IDENTIFIED BY 'REEMPLAZAR_CON_PASSWORD_EDITOR';

GRANT SELECT
ON centro_negocios_db.*
TO 'centro_lector'@'127.0.0.1';

GRANT SELECT, INSERT, UPDATE, DELETE
ON centro_negocios_db.servicios
TO 'centro_editor'@'127.0.0.1';

GRANT SELECT, INSERT, UPDATE, DELETE
ON centro_negocios_db.preguntas
TO 'centro_editor'@'127.0.0.1';

GRANT SELECT, UPDATE
ON centro_negocios_db.nosotros
TO 'centro_editor'@'127.0.0.1';

GRANT INSERT
ON centro_negocios_db.consultas
TO 'centro_editor'@'127.0.0.1';
```

### Crear la configuración privada

Crear esta carpeta fuera de `htdocs`:

```text
/Applications/MAMP/centro-negocios-config/
```

Copiar allí las plantillas de `config-examples`, renombrándolas:

| Plantilla del repositorio | Nombre en la carpeta privada |
| --- | --- |
| `database.example.php` | `database.php` |
| `database-editor.example.php` | `database-editor.php` |
| `auth.example.php` | `auth.php` |

En las copias privadas:

1. Reemplazar las contraseñas por las utilizadas al crear
   los usuarios de MySQL.
2. Generar un token desde la terminal:

```bash
openssl rand -hex 32
```

3. Copiar el resultado en `admin_token` dentro de `auth.php`.

Conservar los valores de ejemplo en el repositorio.
Las contraseñas reales y el token pertenecen únicamente
a los archivos privados.

### Comprobar la instalación

Con MAMP activo, abrir:

```text
http://127.0.0.1:8888/centro-negocios-api/servicios.php
```

Debe devolver los servicios en formato JSON.

Después iniciar el frontend con `npm run dev` y comprobar
que aparecen los contenidos.

Para probar la administración, utilizar Postman y el token
local con los endpoints descritos en este documento.

## Endpoints

Todas las rutas siguientes parten de:

```text
http://127.0.0.1:8888/centro-negocios-api
```

| Método | Ruta | Función | Autenticación |
| --- | --- | --- | --- |
| GET | `/servicios.php` | Consultar servicios | Pública |
| GET | `/nosotros.php` | Consultar Nosotros | Pública |
| GET | `/preguntas.php` | Consultar preguntas frecuentes | Pública |
| POST | `/contacto.php` | Guardar una consulta | Pública |
| GET | `/admin-estado.php` | Comprobar acceso y conexión del editor | Bearer |
| PUT | `/admin-nosotros.php` | Actualizar Nosotros | Bearer |
| PUT | `/admin-servicios.php?id=asesoria` | Actualizar un servicio | Bearer |
| PUT | `/admin-preguntas.php?id=apoyo` | Actualizar una pregunta | Bearer |

Los endpoints administrativos requieren este encabezado:

```text
Authorization: Bearer TU_TOKEN_LOCAL
```

Las solicitudes POST y PUT utilizan:

```text
Content-Type: application/json
```

Los endpoints implementados permiten editar contenido existente.
No se han implementado endpoints administrativos de creación
o eliminación.

## Ejemplo de consulta

En Postman, utilizar POST sobre `/contacto.php`,
con Body → raw → JSON:

```json
{
  "name": "Persona de prueba",
  "email": "prueba@example.com",
  "service": "asesoria",
  "message": "Quisiera información sobre asesoría empresarial.",
  "website": ""
}
```

Respuesta esperada: `201 Created`.

El campo `website` debe permanecer vacío. Es un campo trampa
para detectar algunos envíos automáticos; no sustituye una
protección avanzada contra abuso.

## Componentes reutilizables

`ServiceCard` representa una tarjeta individual y `Services`
organiza la lista de servicios.

`ContactForm` recibe los servicios y la selección desde su
componente padre:

```jsx
<ContactForm
  services={services}
  selectedService={selectedService}
  onServiceChange={setSelectedService}
/>
```

Esto permite que el botón de una tarjeta seleccione el servicio
correspondiente en el formulario.

## Accesibilidad

- Etiquetas asociadas a los campos del formulario.
- Navegación mediante teclado.
- Enlace para saltar al contenido principal.
- Mensajes del formulario anunciados mediante una región de estado.
- Menú móvil con atributos de accesibilidad.
- Documento identificado con `lang="es"`.

## Pruebas manuales realizadas

- Consulta de servicios, Nosotros y preguntas frecuentes.
- Edición de contenidos con Postman.
- Acceso administrativo autorizado.
- Guardado de consultas desde Postman y desde React.
- Rechazo de un correo inválido en PHP.
- Rechazo de solicitudes con el campo trampa rellenado.
- Comprobación de los registros guardados en phpMyAdmin.

Estas comprobaciones son manuales; no constituyen una suite
de pruebas automatizadas.

## Limitaciones actuales

- La aplicación funciona en el entorno local descrito.
- El repositorio de GitHub no equivale a un despliegue del sitio.
- El formulario no envía correos electrónicos.
- Los testimonios son ejemplos ficticios.
- La protección contra bots es básica.
