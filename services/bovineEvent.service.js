const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');

class BovineEventService {
  /**
   * Devuelve todos los eventos registrados
   */
  async find() {
    return await models.BovineEvent.findAll({
      order: [['event_date', 'DESC']],
      include: [
        {
          association: 'bovine',
          attributes: ['ear_tag', 'breed', 'date_of_birth', 'lactation_stage'],
        },
      ],
    });
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

  /**
   * Agrupa eventos por bovino y devuelve una lista única con su último evento.
   */
  _groupBovinesByLatestEvent(events) {
    const map = new Map();
    for (const e of events) {
      if (e.bovine && !map.has(e.bovine.bovine_id)) {
        map.set(e.bovine.bovine_id, {
          ...e.bovine.toJSON(),
          id: e.bovine.bovine_id, // opcional: estandariza el nombre
          last_event: {
            type: e.event_type,
            date: e.event_date,
            severity: e.severity ?? null,
          },
        });
      }
    }
    return Array.from(map.values());
  }

  /**
   * Bovinos con eventos de salud recientes (últimos 30 días).
   */
  async findHealthBovines() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const events = await models.BovineEvent.findAll({
      where: {
        event_category: 'Health',
        result: { [Op.in]: ['Positive', 'Unknown'] },
        event_date: { [Op.gte]: thirtyDaysAgo },
      },
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
      order: [['event_date', 'DESC']],
    });

    return this._groupBovinesByLatestEvent(events);
  }

  /**
   * Bovinos con eventos reproductivos recientes (últimos 30 días).
   */
  async findReproductiveBovines() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const events = await models.BovineEvent.findAll({
      where: {
        event_category: 'Reproduction',
        event_date: { [Op.gte]: thirtyDaysAgo },
      },
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
      order: [['event_date', 'DESC']],
    });

    return this._groupBovinesByLatestEvent(events);
  }
}

module.exports = BovineEventService;
