const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class BovineEventService {
  /**
   * Devuelve todos los eventos registrados
   */
  async find() {
    return await models.BovineEvent.findAll();
  }

  /**
   * Busca un evento por su ID
   * @throws Boom.notFound si no existe
   */
  async findOne(id) {
    const event = await models.BovineEvent.findByPk(id);
    if (!event) {
      throw boom.notFound('BovineEvent not found');
    }
    return event;
  }

  /**
   * Crea un nuevo evento
   * @param {Object} data - Datos del evento
   */
  async create(data) {
    return await models.BovineEvent.create(data);
  }

  /**
   * Actualiza un evento existente
   * @param {number} id - ID del evento
   * @param {Object} changes - Campos a modificar
   */
  async update(id, changes) {
    const event = await this.findOne(id);
    return await event.update(changes);
  }

  /**
   * Elimina un evento físicamente
   * @param {number} id - ID del evento
   */
  async delete(id) {
    const event = await this.findOne(id);
    await event.destroy();
    return { id, message: 'BovineEvent deleted' };
  }
}

module.exports = BovineEventService;
