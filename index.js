const express = require('express');
const routerApi = require('./routes');

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/error.handler');

// Inicializa la aplicación de Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar JSON y habilitar CORS
app.use(express.json());



// Ruta principal
app.get('/', (req, res) => {
  res.send('Welcome to the Milk Production API');
});

routerApi(app);

// Middleware para manejar errores
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

// Inicia el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

