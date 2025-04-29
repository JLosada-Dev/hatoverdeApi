const express = require('express');

const BovineRouter = require('./bovine.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  // Rutas de bovinos
  router.use('/bovines', BovineRouter);
}


module.exports = routerApi;