'use strict';
const { BOVINE_EVENT_TABLE } = require('../models/bovineEvent.model');
const { BOVINE_TABLE } = require('../models/bovine.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(BOVINE_EVENT_TABLE, {
      event_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      bovine_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: BOVINE_TABLE,
          key: 'bovine_id',
        },
        onDelete: 'CASCADE',
      },
      event_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      event_category: {
        type: Sequelize.ENUM('Health', 'Reproduction'),
        allowNull: false,
      },
      event_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      severity: {
        type: Sequelize.ENUM('Mild', 'Moderate', 'Severe'),
      },
      result: {
        type: Sequelize.ENUM('Positive', 'Negative', 'Unknown'),
      },
      lactation_affected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex(
      BOVINE_EVENT_TABLE,
      ['bovine_id', 'event_date'],
      { name: 'idx_bovine_event_bovine_event_date' },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      BOVINE_EVENT_TABLE,
      'idx_bovine_event_bovine_event_date',
    );
    await queryInterface.dropTable(BOVINE_EVENT_TABLE);
  },
};
