// src/services/milkPrediction.service.js
const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class MilkPredictionService {
  /**
   * Devuelve todas las predicciones
   */
  async find() {
    return await models.MilkPrediction.findAll();
  }

  /**
   * Busca una predicción por su ID
   * @throws Boom.notFound si no existe
   */
  async findOne(id) {
    const pred = await models.MilkPrediction.findByPk(id);
    if (!pred) {
      throw boom.notFound('MilkPrediction not found');
    }
    return pred;
  }

  /**
   * Crea una nueva predicción
   * @param {Object} data - Datos de la predicción
   */
  async create(data) {
    return await models.MilkPrediction.create(data);
  }

  /**
   * Actualiza una predicción existente
   * @param {number} id - ID de la predicción
   * @param {Object} changes - Campos a modificar
   */
  async update(id, changes) {
    const pred = await this.findOne(id);
    return await pred.update(changes);
  }

  /**
   * Elimina una predicción físicamente
   * @param {number} id - ID de la predicción
   */
  async delete(id) {
    const pred = await this.findOne(id);
    await pred.destroy();
    return { id, message: 'MilkPrediction deleted' };
  }
}

module.exports = MilkPredictionService;
