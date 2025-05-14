const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const emitter = require('../events/productionEmitter');

class MilkProductionService {
  async find() {
    return await models.MilkProduction.findAll({
      order: [['milking_time', 'DESC']],
      include: [
        {
          association: 'bovine', // Include the cow association
          attributes: ['ear_tag', 'breed', 'date_of_birth', 'lactation_stage'], // Select only the id and name fields
        },
      ],
    });
  }

  async findOne(id) {
    const entry = await models.MilkProduction.findByPk(id);
    if (!entry) {
      throw boom.notFound('MilkProduction not found');
    }
    return entry;
  }

  async create(data) {
    const newProd = await models.MilkProduction.create(data);
    // Disparamos un evento específico del bovino
    emitter.emit(`prod:${newProd.bovine_id}`, newProd.toJSON());
    return newProd;
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
