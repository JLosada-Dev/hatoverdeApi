'use strict';
const { MILK_PRED_TABLE } = require('../models/milkPrediction.model');
const { BOVINE_TABLE } = require('../models/bovine.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(MILK_PRED_TABLE, {
      prediction_id: {
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
      prediction_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      predicted_week_start: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      predicted_week_end: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      predicted_milk_yield: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      prediction_accuracy: {
        type: Sequelize.DECIMAL(4, 2),
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
      MILK_PRED_TABLE,
      ['bovine_id', 'predicted_week_start'],
      { unique: true, name: 'uk_milk_prediction_bovine_weekstart' },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      MILK_PRED_TABLE,
      'uk_milk_prediction_bovine_weekstart',
    );
    await queryInterface.dropTable(MILK_PRED_TABLE);
  },
};
