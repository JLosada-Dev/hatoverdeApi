require('dotenv').config();
const express = require('express');
const cors = require('cors');
const os = require('os');
const routerApi = require('./routes');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/error.handler');

const app = express();
const port = process.env.PORT || 3000;

// 1. JSON parser
app.use(express.json());

// 2. CORS (ajusta al origen de tu Angular)
app.use(cors({ origin: '*' }));

// 3. Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('Welcome to the Milk Production API');
});

// Ruta de prueba para chequeo de conexión
app.get('/ping', (req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});


// 4. Rutas de la API
routerApi(app);

// 5. Manejo de errores
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

// 6. Arranque del servidor con log de IP real
function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const name in ifaces) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
}
app.listen(port, '0.0.0.0', () => {
  const ip = getLocalIP() || 'localhost';
  console.log(`Server running at http://${ip}:${port}`);
});
