const Joi = require('joi');

const createBovineEventSchema = Joi.object({
  bovine_id: Joi.number().integer().positive().required(),
  event_date: Joi.date().iso().optional(),
  event_category: Joi.string().valid('Health', 'Reproduction').required(),
  event_type: Joi.string().max(100).required(),
  severity: Joi.string().valid('Mild', 'Moderate', 'Severe').optional(),
  result: Joi.string().valid('Positive', 'Negative', 'Unknown').optional(),
  lactation_affected: Joi.boolean().optional(),
  notes: Joi.string().allow('').optional(),
});

const updateBovineEventSchema = Joi.object({
  event_date: Joi.date().iso(),
  event_category: Joi.string().valid('Health', 'Reproduction'),
  event_type: Joi.string().max(100),
  severity: Joi.string().valid('Mild', 'Moderate', 'Severe'),
  result: Joi.string().valid('Positive', 'Negative', 'Unknown'),
  lactation_affected: Joi.boolean(),
  notes: Joi.string().allow(''),
});

const getBovineEventSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = { createBovineEventSchema, updateBovineEventSchema };
