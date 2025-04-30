const router = require('express').Router();
const MilkProductionService = require('../services/milkProduction.service');
const service = new MilkProductionService();
const validatorHandler = require('../middlewares/validator.handler');
const {
  createMilkProductionSchema,
  updateMilkProductionSchema,
  getMilkProductionSchema,
} = require('../schemas/milkProduction.schema');

// Obtener todas las producciones
router.get('/', async (req, res, next) => {
  try {
    const data = await service.find();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Obtener una producción por ID
router.get(
  '/:id',
  validatorHandler(getMilkProductionSchema, 'params'),
  async (req, res, next) => {
    try {
      const data = await service.findOne(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
);

// Crear producción de leche
router.post(
  '/',
  validatorHandler(createMilkProductionSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = await service.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },
);

// Actualizar producción
router.put(
  '/:id',
  validatorHandler(getMilkProductionSchema, 'params'),
  validatorHandler(updateMilkProductionSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = await service.update(req.params.id, req.body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
);

// Eliminar producción
router.delete(
  '/:id',
  validatorHandler(getMilkProductionSchema, 'params'),
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
