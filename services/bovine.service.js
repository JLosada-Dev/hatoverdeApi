const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');

class BovineService {
  constructor() {}
  async find() {
    const bovines = await models.Bovine.findAll();
    return bovines;
  }
  async findOne(id) {
    const bovine = await models.Bovine.findByPk(id);
    if (!bovine) {
      throw boom.notFound('Bovine not found');
    }
    return bovine;
  }
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
}

module.exports = BovineService;

