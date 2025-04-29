const Joi = require('joi');

const createMilkPredictionSchema = Joi.object({
  bovine_id: Joi.number().integer().positive().required(),
  prediction_date: Joi.date().iso().optional(),
  predicted_week_start: Joi.date().iso().required(),
  predicted_week_end: Joi.date().iso().required(),
  predicted_milk_yield: Joi.number().positive().precision(2).required(),
  prediction_accuracy: Joi.number().min(0).max(100).precision(2).optional(),
});

const updateMilkPredictionSchema = Joi.object({
  prediction_date: Joi.date().iso(),
  predicted_week_start: Joi.date().iso(),
  predicted_week_end: Joi.date().iso(),
  predicted_milk_yield: Joi.number().positive().precision(2),
  prediction_accuracy: Joi.number().min(0).max(100).precision(2),
});

module.exports = { createMilkPredictionSchema, updateMilkPredictionSchema };
