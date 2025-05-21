// routes/errorEsp32.router.js
const express = require('express');
const { Op } = require('sequelize');
const { models } = require('../libs/sequelize'); // ← importa tu Sequelize central
const Esp32Error = models.Esp32Error; // ← saca el modelo ya inicializado
const { esp32ErrorSchema } = require('../schemas/esp32Error.schema');
const validator = require('../middlewares/validator.handler');
const esp32Emitter = require('../events/esp32Emitter');

const router = express.Router();

// POST /api/v1/error-esp32
router.post(
  '/',
  validator(esp32ErrorSchema, 'body'),
  async (req, res, next) => {
    try {
      const record = await Esp32Error.create(req.body);
      esp32Emitter.emit('newError', record);
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/error-esp32?since=...
router.get('/', async (req, res, next) => {
  try {
    const { since } = req.query;
    const where = since ? { timestamp: { [Op.gt]: new Date(since) } } : {};
    const errors = await Esp32Error.findAll({
      where,
      order: [['timestamp', 'ASC']],
    });
    res.json(errors);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/error-esp32/stream  (SSE)
router.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  const onNew = (error) => res.write(`data: ${JSON.stringify(error)}\n\n`);
  esp32Emitter.on('newError', onNew);
  req.on('close', () => esp32Emitter.off('newError', onNew));
});

module.exports = router;
