const express = require('express');
const BovineService = require('./../services/bovine.service');

const validatorHandler = require('./../middlewares/validator.handler');

const {
  createBovineSchema,
  updateBovineSchema,
  getBovineSchema,
  getBovineByIdSchema,
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

router.get(
  '/by-ear-tag/:ear_tag',
  validatorHandler(getBovineSchema, 'params'),
  async (req, res, next) => {
    try {
      const { ear_tag } = req.params;
      const bovine = await service.findByEarTag(ear_tag);
      res.json(bovine);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/:id',
  validatorHandler(getBovineByIdSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const bovine = await service.findOne(id);
      res.json(bovine);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validatorHandler(createBovineSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newBovine = await service.create(body);
      res.status(201).json(newBovine);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  validatorHandler(getBovineByIdSchema, 'params'),
  validatorHandler(updateBovineSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedBovine = await service.update(id, body);
      res.json(updatedBovine);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(getBovineByIdSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await service.delete(id);
      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);
module.exports = router;
