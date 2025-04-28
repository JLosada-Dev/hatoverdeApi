'use strict';
const { BOVINE_TABLE } = require('../models/bovine.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(BOVINE_TABLE, {
      bovine_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ear_tag: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      breed: {
        type: Sequelize.ENUM('Holstein', 'Ayrshire', 'Jersey'),
        allowNull: false,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      weight_kg: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false,
      },
      sex: {
        type: Sequelize.ENUM('Male', 'Female'),
        allowNull: false,
      },
      lactation_stage: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    // índices adicionales
    await queryInterface.addIndex(BOVINE_TABLE, ['ear_tag'], {
      unique: true,
      name: 'idx_bovine_ear_tag',
    });
    await queryInterface.addIndex(BOVINE_TABLE, ['is_active'], {
      name: 'idx_bovine_is_active',
    });
    await queryInterface.addIndex(BOVINE_TABLE, ['breed'], {
      name: 'idx_bovine_breed',
    });
    await queryInterface.addIndex(BOVINE_TABLE, ['date_of_birth'], {
      name: 'idx_bovine_dob',
    });
    await queryInterface.addIndex(BOVINE_TABLE, ['lactation_stage'], {
      name: 'idx_bovine_lact_stage',
    });
    await queryInterface.addIndex(BOVINE_TABLE, ['sex'], {
      name: 'idx_bovine_sex',
    });
  },

  async down(queryInterface, Sequelize) {
    // Para eliminar en orden inverso: quita los índices y luego la tabla
    await queryInterface.removeIndex(BOVINE_TABLE, 'idx_bovine_sex');
    await queryInterface.removeIndex(BOVINE_TABLE, 'idx_bovine_lact_stage');
    await queryInterface.removeIndex(BOVINE_TABLE, 'idx_bovine_dob');
    await queryInterface.removeIndex(BOVINE_TABLE, 'idx_bovine_breed');
    await queryInterface.removeIndex(BOVINE_TABLE, 'idx_bovine_is_active');
    await queryInterface.removeIndex(BOVINE_TABLE, 'idx_bovine_ear_tag');

    await queryInterface.dropTable(BOVINE_TABLE);
  },
};
