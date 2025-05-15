# 📦 Backend - Gestor de Tareas

Este es el backend del proyecto **Gestor de Tareas**, desarrollado con **Node.js**, **Express** y **MongoDB**. Proporciona una API REST que permite el registro e inicio de sesión de usuarios y la gestión de tareas personales.

## 🚀 Tecnologías utilizadas
- Node.js
- Express
- MongoDB (MongoDB Atlas)
- Mongoose
- JWT (autenticación)
- bcryptjs (encriptación de contraseñas)
- express-validator (validación de datos)
- CORS

## 📂 Estructura del proyecto
backend/
├── models/ → Modelos de Mongoose (User.js, Task.js)
├── routes/ → Rutas para autenticación y tareas
├── middlewares/ → Middleware de autenticación JWT
├── src/
│ ├── index.js → Punto de entrada principal
│ └── database.js → Conexión a MongoDB Atlas
├── .env → Variables de entorno
└── package.json

## 🔐 Variables de entorno
Debes crear un archivo `.env` en la raíz del backend con las siguientes variables:

PORT=3100
MONGO_URI=tu_uri_mongodb
SECRET_KEY=tu_clave_secreta_para_jwt

## ▶️ Cómo ejecutar localmente
1. Instala las dependencias:

npm install

Ejecuta en modo desarrollo:

npm run dev

La API se iniciará en http://localhost:3100


## 📡 Endpoints disponibles

### 🔑 Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registro de usuario |
| POST | /api/auth/login | Login de usuario |
| GET | /api/auth/me | Obtener datos usuario |

### 📋 Tareas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/tasks | Obtener todas tus tareas |
| GET | /api/tasks/:id | Obtener una tarea por ID |
| POST | /api/tasks | Crear nueva tarea |
| PUT | /api/tasks/:id | Editar estado o contenido de tarea |
| DELETE | /api/tasks/:id | Eliminar tarea (solo si completada) |

## ✅ Validaciones con express-validator

Nombre obligatorio
Email válido
Contraseña mínima de 6 caracteres

Login:

Email válido
Contraseña obligatoria

Crear tarea:

Título obligatorio
Fecha opcional con formato ISO

## 🧪 Pruebas

Puedes usar herramientas como:

Postman
Thunder Client (VS Code)
Insomnia

Para probar los endpoints usando tokens JWT.

## 👨‍💻 Autor
Proyecto desarrollado por Bernardo Duran
