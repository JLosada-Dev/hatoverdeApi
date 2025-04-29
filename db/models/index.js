const { BovineSchema, Bovine } = require('./bovine.model');
const {
  MilkProductionSchema,
  MilkProduction,
} = require('./milkProduction.model');
const { BovineEventSchema, BovineEvent } = require('./bovineEvent.model');
const {
  MilkPredictionSchema,
  MilkPrediction,
} = require('./milkPrediction.model');

function setupModels(sequelize) {
  // Initialize models
  Bovine.init(BovineSchema, Bovine.config(sequelize));
  MilkProduction.init(MilkProductionSchema, MilkProduction.config(sequelize));
  BovineEvent.init(BovineEventSchema, BovineEvent.config(sequelize));
  MilkPrediction.init(MilkPredictionSchema, MilkPrediction.config(sequelize));

  // Apply associations
  Bovine.associate(sequelize.models);
  MilkProduction.associate(sequelize.models);
  BovineEvent.associate(sequelize.models);
  MilkPrediction.associate(sequelize.models);
}

module.exports = setupModels;