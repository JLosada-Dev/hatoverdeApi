'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('bovine', 'lactation_stage', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('bovine', 'lactation_stage', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // O el valor anterior que tenías
    });
  },
};
