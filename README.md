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
- [📊 Análisis de Datos](#-análisis-de-datos)
- [🧬 Migraciones](#-migraciones)
- [🔧 Modelos](#-modelos)
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
- Registro de errores de dispositivos ESP32.
- Análisis estadístico de producción lechera.
- Arquitectura modular y escalable.
- Uso de **Docker** para base de datos y pgAdmin.

---

## 🛠️ Requisitos

- Node.js >= 14.17.0
- npm o yarn
- Docker y Docker Compose (opcional, recomendado para base de datos)
- PostgreSQL (si no usas Docker)

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

```env
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

```plaintext
.
├── config/
├── db/
│   ├── migrations/
│   ├── models/
│   └── seeders/
├── events/
│   ├── esp32Emitter.js
│   └── productionEmitter.js
├── libs/
├── middlewares/
├── routes/
│   ├── bovine.router.js
│   ├── bovineEvent.router.js
│   ├── errorEsp32.router.js
│   ├── milkPrediction.router.js
│   └── milkProduction.router.js
├── schemas/
├── services/
│   ├── bovine.service.js
│   ├── bovineEvent.service.js
│   ├── milkPrediction.service.js
│   └── milkProduction.service.js
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

- `GET /api/v1/milk-productions` — Lista todas las producciones
- `GET /api/v1/milk-productions/:id` — Detalles de una producción
- `POST /api/v1/milk-productions` — Crear producción
- `PUT /api/v1/milk-productions/:id` — Actualizar producción
- `DELETE /api/v1/milk-productions/:id` — Eliminar producción

### 📈 Predicciones de Leche

- `GET /api/v1/predictions` — Lista todas las predicciones
- `GET /api/v1/predictions/:id` — Detalles de una predicción
- `POST /api/v1/predictions` — Crear predicción
- `PUT /api/v1/predictions/:id` — Actualizar predicción
- `DELETE /api/v1/predictions/:id` — Eliminar predicción

### 📋 Eventos de Bovinos

- `GET /api/v1/bovine-events` — Lista todos los eventos
- `GET /api/v1/bovine-events/:id` — Detalles de un evento
- `POST /api/v1/bovine-events` — Crear evento
- `PUT /api/v1/bovine-events/:id` — Actualizar evento
- `DELETE /api/v1/bovine-events/:id` — Eliminar evento

### 🔧 Errores ESP32

- `GET /api/v1/esp32-errors` — Lista todos los errores registrados
- `GET /api/v1/esp32-errors/:id` — Detalles de un error
- `POST /api/v1/esp32-errors` — Registrar nuevo error

### 📡 SSE (Server-Sent Events)

- `GET /api/v1/milk-productions/bovine/:id/stream`  
  Recibe notificaciones en tiempo real cuando se registra una nueva producción de leche para el bovino especificado.

---

## 📊 Análisis de Datos

El sistema ofrece diversas funcionalidades de análisis de datos para la gestión eficiente de la producción lechera:

### Producción de Leche

- **Resumen diario por animal**: Totalización de producción por bovino.
- **Resumen diario global**: Estadísticas de todo el hato.
- **Evolución horaria**: Análisis de producción por horas.
- **Metas diarias**: Seguimiento de objetivos por bovino.
- **Umbrales de producción**: Identificación de rangos óptimos y problemáticos.

### Indicadores Clave

- **Productores destacados**: Identifica bovinos con mayor y menor producción.
- **Producción mensual**: Análisis por bovino o global.
- **Tendencias anuales**: Seguimiento de producción total por mes.

### Predicciones

El sistema permite crear predicciones de producción basadas en:

- Etapa de lactación
- Raza
- Historial de producción
- Factores estacionales

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

## 🔧 Modelos

### Bovine

Representación del ganado bovino con los siguientes campos clave:

- `bovine_id`: Identificador único
- `ear_tag`: Etiqueta auricular, identificador visible único
- `breed`: Raza (Holstein, Ayrshire, Jersey)
- `sex`: Sexo (Male, Female)
- `lactation_stage`: Etapa de lactación (0 para machos, 1-5 para hembras)
- `daily_goal`: Meta diaria de producción en litros
- `is_active`: Estado activo del animal

### MilkProduction

Registro de la producción de leche:

- `production_id`: Identificador único
- `bovine_id`: Referencia al bovino
- `milking_time`: Fecha y hora del ordeño
- `milk_yield`: Cantidad de leche producida en litros

### BovineEvent

Eventos relacionados con los bovinos:

- `event_id`: Identificador único
- `bovine_id`: Referencia al bovino
- `event_type`: Tipo de evento (Health, Reproduction, etc.)
- `event_date`: Fecha del evento
- `description`: Descripción detallada del evento

### MilkPrediction

Predicciones de producción de leche:

- `prediction_id`: Identificador único
- `bovine_id`: Referencia al bovino
- `prediction_date`: Fecha de predicción
- `predicted_yield`: Producción estimada en litros

### ESP32Error

Registro de errores de dispositivos ESP32:

- `error_id`: Identificador único
- `device_id`: Identificador del dispositivo
- `error_code`: Código de error
- `description`: Descripción del error
- `timestamp`: Fecha y hora del error

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
