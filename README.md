# 🐄 HatoVerde API

**HatoVerde API** es un sistema de gestión ganadera que centraliza la información sobre bovinos, producción de leche, eventos y predicciones. Está construido con **Node.js**, **Express**, **Sequelize** y **PostgreSQL**, y es fácilmente desplegable con **Docker**.

---

## 📚 Tabla de Contenidos

- [🎯 Características](#-características)
- [🛠️ Requisitos](#-requisitos)
- [📦 Instalación](#-instalación)
- [⚙️ Configuración](#-configuración)
- [🚀 Ejecución](#-ejecución)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [📡 Rutas Principales](#-rutas-principales)
- [🧬 Migraciones](#-migraciones)
- [🤝 Contribuciones](#-contribuciones)
- [📄 Licencia](#-licencia)
- [👤 Autor](#-autor)

---

## 🎯 Características

- CRUD completo para bovinos, producción de leche, predicciones y eventos.
- Validación robusta de datos con **Joi**.
- Manejo de errores con **Boom**.
- Asociaciones entre bovinos y sus producciones, eventos y predicciones.
- Notificaciones en tiempo real con **SSE (Server-Sent Events)**.
- Arquitectura modular y escalable.
- Uso de **Docker** para base de datos y pgAdmin.

---

## 🛠️ Requisitos

- Node.js >= 14.17.0
- npm o yarn
- Docker y Docker Compose (opcional, recomendado para base de datos)

---

## 📦 Instalación

1. Clona el repositorio:

  ```bash
  git clone https://github.com/tu-usuario/hatoverde-api.git
  cd hatoverde-api
  ```

2. Instala las dependencias:

  ```bash
  npm install
  ```

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/hatoverde
```

> 💡 Asegúrate de que `DATABASE_URL` coincida con tus credenciales locales o configuración de Docker.

---

## 🚀 Ejecución

### 🔄 Con Docker (base de datos y pgAdmin)

```bash
docker-compose up -d
```

### 📑 Ejecutar migraciones

```bash
npm run migrations:run
```

### 🧪 Servidor en modo desarrollo

```bash
npm run dev
```

### 🏭 Servidor en modo producción

```bash
npm start
```

Servidor disponible en:  
[http://localhost:3000](http://localhost:3000/)

---

## 📁 Estructura del Proyecto

```
.
├── config/
├── db/
│   ├── migrations/
│   ├── models/
│   └── seeders/
├── events/
├── libs/
├── middlewares/
├── routes/
├── schemas/
├── services/
├── utils/
├── index.js
├── package.json
├── docker-compose.yml
├── .env
└── .sequelizerc
```

---

## 📡 Rutas Principales

### 🐄 Bovinos

- `GET /api/v1/bovines` — Lista todos los bovinos
- `GET /api/v1/bovines/:id` — Detalles de un bovino
- `POST /api/v1/bovines` — Crear bovino
- `PATCH /api/v1/bovines/:id` — Editar bovino
- `DELETE /api/v1/bovines/:id` — Desactivar bovino

### 🥛 Producción de Leche

- `GET /api/v1/milk-productions`
- `GET /api/v1/milk-productions/:id`
- `POST /api/v1/milk-productions`
- `PUT /api/v1/milk-productions/:id`
- `DELETE /api/v1/milk-productions/:id`

### 📈 Predicciones de Leche

- `GET /api/v1/predictions`
- `GET /api/v1/predictions/:id`
- `POST /api/v1/predictions`
- `PUT /api/v1/predictions/:id`
- `DELETE /api/v1/predictions/:id`

### 📋 Eventos de Bovinos

- `GET /api/v1/bovine-events`
- `GET /api/v1/bovine-events/:id`
- `POST /api/v1/bovine-events`
- `PUT /api/v1/bovine-events/:id`
- `DELETE /api/v1/bovine-events/:id`

### 📡 SSE (Server-Sent Events)

- `GET /api/v1/milk-productions/bovine/:id/stream`  
  Recibe notificaciones en tiempo real cuando se registra una nueva producción de leche para el bovino especificado.

---

## 🧬 Migraciones

- Crear nueva migración:

  ```bash
  npm run migrations:generate -- nombre-de-la-migracion
  ```

- Ejecutar migraciones:

  ```bash
  npm run migrations:run
  ```

- Revertir última migración:

  ```bash
  npm run migrations:revert
  ```

- Revertir todas las migraciones:

  ```bash
  npm run migrations:delete
  ```

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para colaborar:

1. Haz un fork del repositorio.
2. Crea una nueva rama:

  ```bash
  git checkout -b feature/nueva-funcionalidad
  ```

3. Realiza tus cambios y haz commit:

  ```bash
  git commit -m "Agrega nueva funcionalidad"
  ```

4. Sube tu rama:

  ```bash
  git push origin feature/nueva-funcionalidad
  ```

5. Abre un **Pull Request**.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más información.

---

## 👤 Autor

### @JLosada-Dev - ByteCrafters

Repositorio original:  
[https://github.com/tu-usuario/hatoverde-api](https://github.com/tu-usuario/hatoverde-api)
