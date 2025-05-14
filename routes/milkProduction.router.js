const router = require('express').Router();
const MilkProductionService = require('../services/milkProduction.service');
const service = new MilkProductionService();
const validatorHandler = require('../middlewares/validator.handler');
const {
  createMilkProductionSchema,
  updateMilkProductionSchema,
  getMilkProductionSchema,
  dateQuerySchema,
} = require('../schemas/milkProduction.schema');
const emitter = require('../events/productionEmitter');
// ——————————————
//  SSE endpoint: escucha nuevas producciones de un bovino
// ——————————————
router.get('/bovine/:id/stream', (req, res) => {
  const bovineId = req.params.id;
  // headers SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Comentario inicial
  res.write(`: connected to bovine ${bovineId}\n\n`);

  // Listener
  const onNew = (prod) => {
    res.write(`data: ${JSON.stringify(prod)}\n\n`);
  };
  emitter.on(`prod:${bovineId}`, onNew);

  // Cuando el cliente cierra la conexión...
  req.on('close', () => {
    emitter.off(`prod:${bovineId}`, onNew);
    res.end();
  });
});

// ——————————————
// resúmenes y gráficos
// ——————————————

router.get(
  '/bovine/:id/daily-summary',
  validatorHandler(getMilkProductionSchema, 'params'),
  validatorHandler(dateQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { date } = req.query;
      const summary = await service.dailySummary(+id, date);
      res.json(summary);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/bovine/:id/daily-hourly',
  validatorHandler(getMilkProductionSchema, 'params'),
  validatorHandler(dateQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { date } = req.query;
      const points = await service.dailyHourly(+id, date);
      res.json(points);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/bovine/:id/daily-goal',
  validatorHandler(getMilkProductionSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const goal = await service.getDailyGoal(+id);
      res.json(goal);
    } catch (err) {
      next(err);
    }
  },
);

router.get('/thresholds', async (req, res, next) => {
  try {
    const thr = await service.getThresholds();
    res.json(thr);
  } catch (err) {
    next(err);
  }
});

// ——————————————
// CRUD
// ——————————————

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
