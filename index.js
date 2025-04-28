const express = require('express');
const cors = require('cors');

// Inicializa la aplicación de Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar JSON y habilitar CORS
app.use(express.json());
app.use(cors()); // Agregar cors como middleware si necesitas manejar solicitudes de otros dominios

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor Levantado');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
