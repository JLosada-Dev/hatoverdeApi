const router = require('express').Router();
const MilkPredictionService = require('../services/milkPrediction.service');
const service = new MilkPredictionService();
const validatorHandler = require('../middlewares/validator.handler');
const {
  createMilkPredictionSchema,
  updateMilkPredictionSchema,
  getMilkPredictionSchema,
} = require('../schemas/milkPrediction.schema');

// Obtener todas las predicciones
router.get('/', async (req, res, next) => {
  try {
    const data = await service.find();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Obtener predicción por ID
router.get(
  '/:id',
  validatorHandler(getMilkPredictionSchema, 'params'),
  async (req, res, next) => {
    try {
      const data = await service.findOne(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
);

// Crear predicción
router.post(
  '/',
  validatorHandler(createMilkPredictionSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = await service.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },
);

// Actualizar predicción
router.put(
  '/:id',
  validatorHandler(getMilkPredictionSchema, 'params'),
  validatorHandler(updateMilkPredictionSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = await service.update(req.params.id, req.body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
);

// Eliminar predicción
router.delete(
  '/:id',
  validatorHandler(getMilkPredictionSchema, 'params'),
  async (req, res, next) => {
    try {
      const data = await service.delete(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
