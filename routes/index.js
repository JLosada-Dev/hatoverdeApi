// src/routes/index.js
const express = require('express');

const BovineRouter = require('./bovine.router');
const MilkProductionRouter = require('./milkProduction.router');
const BovineEventRouter = require('./bovineEvent.router');
const MilkPredictionRouter = require('./milkPrediction.router');
const ErrorEsp32Router = require('./errorEsp32.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  //bovinos
  router.use('/bovines', BovineRouter);
  //producción de leche
  router.use('/milk-productions', MilkProductionRouter);
  //eventos de bovino
  router.use('/bovine-events', BovineEventRouter);
  //predicciones de leche
  router.use('/predictions', MilkPredictionRouter);
  //errores de esp32
  router.use('/error-esp32', ErrorEsp32Router);
}

module.exports = routerApi;
