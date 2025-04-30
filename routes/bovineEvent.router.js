const router = require('express').Router();
const BovineEventService = require('../services/bovineEvent.service');
const service = new BovineEventService();
const validatorHandler = require('../middlewares/validator.handler');
const {
  createBovineEventSchema,
  updateBovineEventSchema,
  getBovineEventSchema,
} = require('../schemas/bovineEvent.schema');

// Obtener todos los eventos
router.get('/', async (req, res, next) => {
  try {
    const data = await service.find();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Obtener evento por ID
router.get(
  '/:id',
  validatorHandler(getBovineEventSchema, 'params'),
  async (req, res, next) => {
    try {
      const data = await service.findOne(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
);

// Crear evento
router.post(
  '/',
  validatorHandler(createBovineEventSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = await service.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },
);

// Actualizar evento
router.put(
  '/:id',
  validatorHandler(getBovineEventSchema, 'params'),
  validatorHandler(updateBovineEventSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = await service.update(req.params.id, req.body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
);

// Eliminar evento
router.delete(
  '/:id',
  validatorHandler(getBovineEventSchema, 'params'),
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
