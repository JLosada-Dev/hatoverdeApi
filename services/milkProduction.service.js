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

    // Cargar bovino relacionado
    const prodWithBovine = await models.MilkProduction.findByPk(
      newProd.production_id,
      {
        include: [
          {
            association: 'bovine',
            attributes: [
              'bovine_id',
              'ear_tag',
              'breed',
              'date_of_birth',
              'lactation_stage',
            ],
          },
        ],
      },
    );

    // Emitimos los datos completos que espera el frontend
    const payload = prodWithBovine.toJSON();
    emitter.emit('production:new', payload);
    emitter.emit(`prod:${payload.bovine_id}`, payload);

    return prodWithBovine;
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
      [fn('round', fn('avg', col('milk_yield')), 2), 'average'],
      [fn('round', fn('min', col('milk_yield')), 2), 'min'],
      [fn('round', fn('max', col('milk_yield')), 2), 'max'],
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
   * Resumen diario global (toda la producción del día)
   */
  async dailySummaryGlobal(date) {
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
        milking_time: { [Op.between]: [start, end] },
      },
      raw: true,
    });
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

  /**
   * 5) Bovine con mayor y menor producción total
   */
  async topAndLowestProducer(date) {
    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();

    // Agrupamos por bovino y sumamos la producción
    const results = await models.MilkProduction.findAll({
      attributes: ['bovine_id', [fn('sum', col('milk_yield')), 'totalYield']],
      include: [
        {
          association: 'bovine',
          attributes: ['ear_tag', 'breed', 'date_of_birth', 'lactation_stage'],
        },
      ],
      where: {
        milking_time: { [Op.between]: [start, end] },
      },
      group: [
        'MilkProduction.bovine_id',
        'bovine.bovine_id',
        'bovine.ear_tag',
        'bovine.breed',
        'bovine.date_of_birth',
        'bovine.lactation_stage',
      ],
      order: [[fn('sum', col('milk_yield')), 'DESC']],
      raw: false,
    });

    if (results.length === 0) {
      return { topProducer: null, lowestProducer: null };
    }

    // El include trae los datos del bovino directamente
    const top = results[0];
    const low = results[results.length - 1];

    return {
      topProducer: {
        ...(top.bovine?.toJSON?.() ?? top.bovine),
        totalYield: +top.get('totalYield'),
      },
      lowestProducer: {
        ...(low.bovine?.toJSON?.() ?? low.bovine),
        totalYield: +low.get('totalYield'),
      },
    };
  }

  /**
   * 6) Producción mensual por bovino (o global)
   *    Devuelve la suma diaria de leche para un mes y bovino opcional.
   *    Si no se pasa bovineId, devuelve la suma global.
   */
  async monthlyProduction({ bovineId, year, month }) {
    // month: 1-12
    const start = moment({ year, month: month - 1, day: 1 })
      .startOf('month')
      .toDate();
    const end = moment(start).endOf('month').toDate();

    const where = {
      milking_time: { [Op.between]: [start, end] },
    };
    if (bovineId) {
      where.bovine_id = bovineId;
    }

    const rows = await models.MilkProduction.findAll({
      attributes: [
        [fn('date', col('milking_time')), 'date'],
        [fn('sum', col('milk_yield')), 'totalYield'],
      ],
      where,
      group: [fn('date', col('milking_time'))],
      order: [[fn('date', col('milking_time')), 'ASC']],
      raw: true,
    });

    // Devuelve [{ date: '2024-06-01', totalYield: 12 }, ...]
    return rows.map((r) => ({
      date: r.date,
      totalYield: +r.totalYield,
    }));
  }

  /**
   * 7) Producción total por mes (global)
   *    Devuelve la suma total de leche producida por mes en todo el rebaño.
   */
  async totalByMonth({ year }) {
    const start = moment({ year, month: 0, day: 1 }).startOf('year').toDate();
    const end = moment(start).endOf('year').toDate();

    const rows = await models.MilkProduction.findAll({
      attributes: [
        [fn('date_trunc', 'month', col('milking_time')), 'month'],
        [fn('sum', col('milk_yield')), 'totalYield'],
      ],
      where: {
        milking_time: { [Op.between]: [start, end] },
      },
      group: [literal(`date_trunc('month', milking_time)`)],
      order: [[literal(`date_trunc('month', milking_time)`), 'ASC']],
      raw: true,
    });

    // Devuelve [{ month: '2024-01-01T00:00:00.000Z', totalYield: 1234 }, ...]
    return rows.map((r) => ({
      month: r.month,
      totalYield: +r.totalYield,
    }));
  }
}

module.exports = MilkProductionService;
