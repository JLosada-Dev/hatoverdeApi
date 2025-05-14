const Joi = require('joi');

const createMilkProductionSchema = Joi.object({
  bovine_id: Joi.number().integer().positive().required(),
  milking_time: Joi.date().iso().optional(), // si no viene, DB usa NOW()
  milk_yield: Joi.number().positive().precision(2).required(),
  milk_fat: Joi.number().precision(1).optional(),
  milk_protein: Joi.number().precision(1).optional(),
});

const updateMilkProductionSchema = Joi.object({
  milking_time: Joi.date().iso(),
  milk_yield: Joi.number().positive().precision(2),
  milk_fat: Joi.number().precision(1),
  milk_protein: Joi.number().precision(1),
});

const getMilkProductionSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const dateQuerySchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
});

module.exports = {
  createMilkProductionSchema,
  updateMilkProductionSchema,
  getMilkProductionSchema,
  dateQuerySchema,
};
