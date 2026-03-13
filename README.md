# 🐾 Adopt Me — API de Adopción de Mascotas

API REST para gestionar la adopción de mascotas. Permite registrar usuarios, administrar mascotas y procesar adopciones. Construida con **Express 5**, autenticación **JWT** (header + cookies HTTP-only), múltiples motores de persistencia y documentación interactiva con **Swagger**.

---

## 📑 Tabla de contenidos

- [Características principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Variables de entorno](#-variables-de-entorno)
- [Modos de persistencia](#-modos-de-persistencia)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Resumen de endpoints](#-resumen-de-endpoints)
- [Autenticación y autorización](#-autenticación-y-autorización)
- [Documentación Swagger](#-documentación-swagger)
- [Testing](#-testing)
- [Usuario administrador inicial](#-usuario-administrador-inicial)
- [Logging](#-logging)
- [Subida de imágenes](#-subida-de-imágenes)
- [Docker](#-docker)

---

## ✨ Características principales

- Registro, login, refresh de tokens y recuperación de contraseña por email.
- CRUD completo de **usuarios**, **mascotas** y **adopciones**.
- Roles de usuario: `user` y `admin` con autorización por rol.
- Tres motores de persistencia intercambiables: **Memory**, **File (JSON)** y **MongoDB**.
- Subida de fotos de mascotas (hasta 10 imágenes, máx. 2 MB c/u).
- Rate limiting, CORS configurable y cabeceras seguras con Helmet.
- Logging estructurado con Winston (consola + archivos).
- Documentación interactiva con Swagger UI.
- Tests de integración con Mocha, Chai y Supertest.
- Listo para Docker con docker-compose (API + MongoDB).

---

## 🛠 Tecnologías

| Categoría | Herramientas |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express 5 |
| Autenticación | Passport.js (Local + JWT), jsonwebtoken, argon2 |
| Base de datos | MongoDB (Mongoose 9) / JSON en archivo / Memoria |
| Validación | express-validator |
| Documentación | swagger-ui-express, OpenAPI 3.0 (YAML) |
| Logging | Winston |
| Subida de archivos | Multer |
| Email | Nodemailer (SMTP Gmail) |
| Seguridad | Helmet, CORS, express-rate-limit |
| Testing | Mocha, Chai, Supertest, Faker |
| Contenedores | Docker, Docker Compose |

---

## 📋 Requisitos previos

- **Node.js** ≥ 20
- **npm** ≥ 9
- **MongoDB** (solo si usás persistencia `mongo`; o bien usá Docker)

---

## 🚀 Instalación y ejecución

### Modo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/charlyr95/adopt-me-backend.git
cd adopt-me-backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env (ver sección de variables de entorno)
cp .env.sample .env

# 4. Ejecutar en modo desarrollo (con watch/hot-reload)
npm run dev

# 5. Ejecutar en modo producción
npm start
```

La API estará disponible en `http://localhost:8080`.

### Con Docker Compose

```bash
docker compose up --build
```

Esto levanta la API y una instancia de MongoDB 7 automáticamente. La persistencia se configura como `mongo` por defecto.

---

## ⚙️ Variables de entorno

Creá un archivo `.env` en la raíz del proyecto. A continuación todas las variables disponibles con sus valores por defecto:

| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto del servidor | `8080` |
| `NODE_ENV` | Entorno (`development`, `production`, `test`) | `development` |
| `PERSISTENCE` | Motor de datos: `memory`, `file` o `mongo` | `memory` |
| `MONGO_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/adoptme` |
| `DB_NAME` | Nombre de la base de datos | `adoptme` |
| `JWT_ACCESS_SECRET` | Secreto para firmar access tokens | `access-secret-dev` |
| `JWT_REFRESH_SECRET` | Secreto para firmar refresh tokens | `refresh-secret-dev` |
| `ACCESS_TOKEN_EXPIRES_IN` | Expiración del access token | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN` | Expiración del refresh token | `7d` |
| `RATE_LIMIT_WINDOW_MINUTES` | Ventana de tiempo para rate limiting | `5` |
| `RATE_LIMIT_MAX` | Máximo de peticiones por ventana | `30` |
| `CORS_ORIGIN` | Orígenes permitidos para CORS | `*` |
| `EMAIL_USER` | Usuario SMTP (Gmail) para envío de emails | _(vacío)_ |
| `EMAIL_PASS` | Contraseña/app password SMTP | _(vacío)_ |
| `EMAIL_FROM` | Dirección "From" en los correos | _(vacío)_ |
| `APP_BASE_URL` | URL base de la app (usada en links de emails) | `http://localhost:8080` |
| `RESET_TOKEN_TTL_MINUTES` | Tiempo de vida del token de reset de contraseña | `15` |

> ⚠️ **Importante:** en producción, cambiá los secretos JWT por valores seguros y no uses los defaults.

---

## 💾 Modos de persistencia

La app soporta tres motores de datos, configurables con la variable `PERSISTENCE`:

| Modo | Descripción |
|---|---|
| `memory` | Almacenamiento en memoria (se pierde al reiniciar). Ideal para desarrollo rápido y tests. |
| `file` | Lectura/escritura en archivos JSON dentro de `data/`. Persiste entre reinicios sin necesidad de BD. |
| `mongo` | Base de datos MongoDB. Recomendado para producción. |

El patrón **DAO Factory** (`src/dao/factory.js`) instancia automáticamente los DAOs correctos según la configuración.

---

## 📂 Estructura del proyecto

```
adopt-me/
├── data/                   # Archivos generados por el runtime (db json, logs, uploads)
├── src/
│   ├── app.js              # Configuración de Express (middlewares, rutas)
│   ├── server.js           # Bootstrap: conexión a BD, creación de admin, listen
│   ├── bootstrap/          # Creación automática del usuario admin inicial
│   ├── config/             # Configuraciones (env, CORS, cookies, passport, rate-limit, DB)
│   ├── controllers/        # Controladores de cada recurso
│   ├── dao/                # Data Access Objects (memory, file, mongo)
│   │   ├── factory.js      # Factory que selecciona el motor de persistencia
│   │   ├── memory/         # DAOs en memoria
│   │   ├── file/           # DAOs con archivos JSON
│   │   └── mongo/          # DAOs con Mongoose (incluye modelos)
│   ├── docs/swagger/       # Documentación OpenAPI (YAML) + configuración Swagger
│   ├── dto/                # Data Transfer Objects (respuestas estandarizadas)
│   ├── middlewares/        # Auth, validación, logging, upload, manejo de errores
│   ├── mock/               # Generadores de datos falsos (Faker)
│   ├── repositories/       # Capa de repositorio (abstracción sobre DAOs + mapper)
│   ├── routes/             # Definición de rutas por recurso
│   ├── services/           # Lógica de negocio
│   └── utils/              # Utilidades (logger, hash, JWT, mailer, health check)
├── test/                   # Tests de integración
├── Dockerfile
├── docker-compose.yml
└── package.json
```


La arquitectura sigue un patrón por capas: **Routes → Controllers → Services → Repositories → DAOs**.

---

## 📡 Resumen de endpoints

> 📖 Para ver el detalle completo de cada endpoint (parámetros, body, respuestas, ejemplos), consultá la [documentación Swagger](#-documentación-swagger) en `/api/docs`.

### Salud

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado del servicio (uptime, memoria, CPU) |

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registro de nuevo usuario |
| `POST` | `/api/auth/login` | Inicio de sesión (retorna tokens) |
| `POST` | `/api/auth/refresh` | Renovar access token con refresh token |
| `GET` | `/api/auth/current` | Obtener usuario autenticado actual 🔒 |
| `POST` | `/api/auth/logout` | Cerrar sesión (limpia cookies) |
| `POST` | `/api/auth/forgot-password` | Solicitar email de recuperación de contraseña |
| `POST` | `/api/auth/reset-password` | Restablecer contraseña con token |

### Usuarios (`/api/users`) — 🔒 Solo admin

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/users` | Listar usuarios (filtro por rol) |
| `GET` | `/api/users/:id` | Obtener usuario por ID |
| `POST` | `/api/users` | Crear usuario |
| `PATCH` | `/api/users/:id` | Actualizar usuario |
| `DELETE` | `/api/users/:id` | Eliminar usuario |

### Mascotas (`/api/pets`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/pets` | Listar mascotas (filtros: status, species) |
| `GET` | `/api/pets/:id` | Obtener mascota por ID |
| `POST` | `/api/pets` | Crear mascota (con fotos) 🔒 Admin |
| `PATCH` | `/api/pets/:id` | Actualizar mascota 🔒 Admin |
| `DELETE` | `/api/pets/:id` | Eliminar mascota 🔒 Admin |

### Adopciones (`/api/adoptions`) — 🔒 Autenticado

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/adoptions` | Listar adopciones |
| `POST` | `/api/adoptions` | Crear adopción (requiere `petId`) |

> 🔒 = Requiere autenticación · 🔒 Admin = Requiere rol `admin`

---

## 🔐 Autenticación y autorización

La API utiliza **JWT** con dos mecanismos de entrega:

1. **Bearer Token** — header `Authorization: Bearer <accessToken>`
2. **Cookie HTTP-only** — se establece automáticamente en login

### Flujo de tokens

1. El usuario se registra o inicia sesión → recibe `accessToken` + `refreshToken`.
2. El `accessToken` se usa en cada request protegida (por header o cookie).
3. Cuando el access token expira, se renueva con `POST /api/auth/refresh` enviando el `refreshToken`.

### Roles

| Rol | Permisos |
|---|---|
| `user` | Consultar mascotas, crear adopciones, ver su perfil |
| `admin` | Todo lo anterior + CRUD de usuarios y mascotas |

### Recuperación de contraseña

1. `POST /api/auth/forgot-password` con el email → envía un correo con un link de reset.
2. `POST /api/auth/reset-password?token=<token>` con la nueva contraseña.

---

## 📖 Documentación Swagger

Con el servidor corriendo, accedé a:

```
http://localhost:8080/api/docs
```

Ahí encontrás la documentación interactiva generada a partir de los archivos YAML en `src/docs/swagger/`. Podés probar los endpoints directamente desde el navegador.

---

## 🧪 Testing

Los tests de integración están escritos con **Mocha**, **Chai** y **Supertest**. El setup global vive en `test/_setup.cjs` y se aplica vía `.mocharc.cjs`, donde se setea `NODE_ENV=test` y se conecta a Mongo cuando `PERSISTENCE=mongo`.

```bash
# Ejecutar todos los tests
npm test
```

Por defecto el setup usa `PERSISTENCE=memory`. Si querés usar otro motor:

```bash
# macOS/Linux
PERSISTENCE=mongo npm test

# Windows PowerShell
$env:PERSISTENCE="mongo"; npm test

# Windows CMD
set PERSISTENCE=mongo && npm test
```

Los archivos de test se encuentran en la carpeta `test/`:
- `auth.test.js` — Registro, login, refresh, logout y recuperación de contraseña.
- `users.test.js` — CRUD de usuarios y autorización por rol.
- `pets.test.js` — CRUD de mascotas.
- `adoptions.test.js` — Flujo de adopción.

---

## 👤 Usuario administrador inicial

Al iniciar la aplicación, si no existe ningún usuario con rol `admin`, se crea uno automáticamente:

- **Email:** `admin@test.com`
- **Contraseña:** se genera aleatoriamente y se muestra en los logs del servidor.

> ⚠️ Revisá la consola o el archivo `data/logs/combined.log` para obtener la contraseña generada. Se recomienda cambiarla inmediatamente.

---

## 📝 Logging

Se utiliza **Winston** con la siguiente configuración:

| Transporte | Archivo | Contenido |
|---|---|---|
| Archivo | `data/logs/error.log` | Solo errores |
| Archivo | `data/logs/combined.log` | Todos los niveles |
| Consola | — | Todos los niveles (solo en desarrollo) |

Además, un middleware registra cada request HTTP (método, URL, status, duración).

---

## 🖼 Subida de imágenes

Las fotos de mascotas se suben mediante `multipart/form-data` en el campo `photos`:

- **Formatos permitidos:** JPEG, PNG, GIF, WebP
- **Tamaño máximo por archivo:** 2 MB
- **Máximo de archivos por request:** 10
- **Directorio de almacenamiento:** `data/uploads/`
- **Servido estáticamente en:** `/uploads/<nombre-archivo>`

---

## 🐳 Docker

### Dockerfile

Imagen basada en `node:20-alpine`. Copia las dependencias, instala y expone el puerto 8080.

### Docker Compose

```bash
# Levantar API + MongoDB
docker compose up --build

# Levantar en segundo plano
docker compose up -d --build

# Detener
docker compose down
```

**Servicios incluidos:**

| Servicio | Imagen | Puerto |
|---|---|---|
| `api` | Build local | `8080:8080` |
| `mongo` | `mongo:7` | `27017:27017` |

Los datos de MongoDB se persisten en el volumen `mongo_data`.

---

## 📄 Licencia

MIT
