'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('esp32_errors', {
      error_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      production_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'milk_production', // coincide con MILK_PROD_TABLE
          key: 'production_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      error_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mensaje: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('esp32_errors');
  },
};
