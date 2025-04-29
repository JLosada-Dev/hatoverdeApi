const express = require('express');
const BovineService = require('./../services/bovine.service');

const validatorHandler = require('./../middlewares/validator.handler');

const {
  createBovineSchema,
  updateBovineSchema,
  getBovineSchema,
} = require('./../schemas/bovine.schema');

const router = express.Router();
const service = new BovineService();

// Obtener todos los bovinos
router.get('/', async (req, res, next) => {
  try {
    const bovines = await service.find();
    res.json(bovines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
