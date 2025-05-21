const boom = require('@hapi/boom');
const { Op, fn, col, literal } = require('sequelize');
const { models } = require('../libs/sequelize');
const moment = require('moment');
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
    emitter.emit('production:new', newProd.toJSON());
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

  /**
   * 1) Resumen diario por animal
   */
  async dailySummary(id, date) {
    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();
    const row = await models.MilkProduction.findOne({
      attributes: [
        [literal(`'${date}'`), 'date'],
        [fn('sum', col('milk_yield')), 'total'],
        [fn('count', col('production_id')), 'count'],
        [fn('avg', col('milk_yield')), 'average'],
        [fn('min', col('milk_yield')), 'min'],
        [fn('max', col('milk_yield')), 'max'],
      ],
      where: {
        bovine_id: id,
        milking_time: { [Op.between]: [start, end] },
      },
      raw: true,
    });
    // Sequelize devuelve todo como string, convertimos a number
    return {
      date: row.date,
      total: +row.total,
      count: +row.count,
      average: +row.average,
      min: +row.min,
      max: +row.max,
    };
  }

  /**
   * 2) Evolución horaria agrupada
   */
  async dailyHourly(bovineId, date) {
    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();

    const rows = await models.MilkProduction.findAll({
      attributes: [
        // extraemos una cadena "08:00", "09:00", …
        [literal(`to_char(milking_time, 'HH24:00')`), 'hour'],
        [fn('sum', col('milk_yield')), 'totalYield'],
      ],
      where: {
        bovine_id: bovineId,
        milking_time: { [Op.between]: [start, end] },
      },
      group: [literal(`to_char(milking_time, 'HH24:00')`)],
      order: [[literal(`to_char(milking_time, 'HH24:00')`), 'ASC']],
      raw: true,
    });

    return rows.map((r) => ({
      hour: r.hour,
      totalYield: +r.totalYield,
    }));
  }

  /**
   * 4a) Meta diaria de un bovino
   *    (aquí la sacamos del modelo Bovine.daily_goal, o devolvemos un default)
   */
  async getDailyGoal(bovineId) {
    const bovine = await models.Bovine.findByPk(bovineId, {
      attributes: ['bovine_id', 'ear_tag', 'daily_goal'], // asume daily_goal existe
      raw: true,
    });
    return {
      bovine_id: bovineId,
      dailyGoal: bovine?.daily_goal ?? 20, // default 20 L
    };
  }

  /**
   * 4b) Umbrales globales
   */
  async getThresholds() {
    // Podrías leerlos de BD o de config/env
    return {
      low: 5, // <5 L rojo
      high: 15, // >15 L verde
    };
  }
}

module.exports = MilkProductionService;
