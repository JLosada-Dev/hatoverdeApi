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

module.exports = { createMilkProductionSchema, updateMilkProductionSchema };
