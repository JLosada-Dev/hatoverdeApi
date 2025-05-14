'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bovine', 'daily_goal', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 20,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('bovine', 'daily_goal');
  },
};
