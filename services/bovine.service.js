const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');

class BovineService {
  /**
   * Devuelve todos los bovinos activos
   */
  async find() {
    const bovines = await models.Bovine.findAll({
      order: [['bovine_id', 'ASC']],
    });
    return bovines;
  }
  /**
   * Busca un bovino por su ID
   * @throws Boom.notFound si no existe
   */
  async findOne(id) {
    const bovine = await models.Bovine.findOne({
      where: { bovine_id: id },
    });
    if (!bovine) {
      throw boom.notFound('Bovine not found');
    }
    return bovine;
  }

  async findByEarTag(ear_tag) {
    const bovine = await models.Bovine.findOne({
      where: { ear_tag },
    });
    if (!bovine) {
      throw boom.notFound('Bovine not found');
    }
    return bovine;
  }

  /**
   * Crea un nuevo bovino
   * @param {Object} data - Datos del bovino
   */
  async create(data) {
    const newBovine = await models.Bovine.create(data);
    return newBovine;
  }
  async update(id, changes) {
    const bovine = await this.findOne(id);
    const updatedBovine = await bovine.update(changes);
    return updatedBovine;
  }
  async delete(id) {
    const bovine = await this.findOne(id);
    // Soft delete: deactivate instead of removing
    await bovine.update({ is_active: false });
    return { id, message: 'Bovine deactivated' };
  }

  /**
   * Cambia el estado de is_active de un bovino
   * @param {number} id - ID del bovino
   * @param {boolean} is_active - Nuevo estado
   */
  async toggleActive(id) {
    const bovine = await this.findOne(id);
    const newStatus = !bovine.is_active;
    await bovine.update({ is_active: newStatus });
    return { id, is_active: newStatus };
  }
}

module.exports = BovineService;
