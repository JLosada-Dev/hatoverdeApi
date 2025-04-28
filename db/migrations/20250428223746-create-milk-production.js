'use strict';
const { MILK_PROD_TABLE } = require('../models/milkProduction.model');
const { BOVINE_TABLE } = require('../models/bovine.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(MILK_PROD_TABLE, {
      production_id: {
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
      milking_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      milk_yield: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      milk_fat: {
        type: Sequelize.DECIMAL(3, 1),
      },
      milk_protein: {
        type: Sequelize.DECIMAL(3, 1),
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
      MILK_PROD_TABLE,
      ['bovine_id', 'milking_time'],
      { name: 'idx_milk_production_bovine_milking' },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      MILK_PROD_TABLE,
      'idx_milk_production_bovine_milking',
    );
    await queryInterface.dropTable(MILK_PROD_TABLE);
  },
};
