const Joi = require('joi');

const createBovineSchema = Joi.object({
  ear_tag: Joi.string().max(50).required(),
  breed: Joi.string().valid('Holstein', 'Ayrshire', 'Jersey').required(),
  date_of_birth: Joi.date().iso().required(),
  weight_kg: Joi.number().positive().precision(2).required(),
  sex: Joi.string().valid('Male', 'Female'),
  lactation_stage: Joi.number().integer().min(0).max(5).required(),
  is_active: Joi.boolean().optional(), // por defecto true en BD
});

const updateBovineSchema = Joi.object({
  ear_tag: Joi.string().max(50),
  breed: Joi.string().valid('Holstein', 'Ayrshire', 'Jersey'),
  date_of_birth: Joi.date().iso(),
  weight_kg: Joi.number().positive().precision(2),
  sex: Joi.string().valid('Male', 'Female'),
  lactation_stage: Joi.number().integer().min(1).max(5),
  is_active: Joi.boolean(),
});

const getBovineSchema = Joi.object({
  ear_tag: Joi.string().max(50).required(),
});
const getBovineByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  createBovineSchema,
  updateBovineSchema,
  getBovineSchema,
  getBovineByIdSchema,
};
