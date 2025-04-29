const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class MilkProductionService {
  async find() {
    return await models.MilkProduction.findAll();
  }

  async findOne(id) {
    const entry = await models.MilkProduction.findByPk(id);
    if (!entry) {
      throw boom.notFound('MilkProduction not found');
    }
    return entry;
  }

  async create(data) {
    return await models.MilkProduction.create(data);
  }

  async update(id, changes) {
    const entry = await this.findOne(id);
    return await entry.update(changes);
  }

  async delete(id) {
    const entry = await this.findOne(id);
    await entry.destroy();
    return { id, message: 'MilkProduction deleted' };
  }
}

module.exports = MilkProductionService;
