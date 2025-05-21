const Joi = require('joi');

const esp32ErrorSchema = Joi.object({
  production_id: Joi.number().integer().optional(),
  error_code: Joi.number().integer().required(),
  mensaje: Joi.string().min(1).required(),
  timestamp: Joi.string().isoDate().optional(),
});

module.exports = { esp32ErrorSchema };
