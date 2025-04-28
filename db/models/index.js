const { Bovine, BovineSchema } = require('./bovine.model');

function setupModels(squelize) {
  Bovine.init(BovineSchema, Bovine.config(sequelize));
}

module.exports = setupModels;
