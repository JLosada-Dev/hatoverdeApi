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
const { Esp32ErrorSchema, Esp32Error } = require('./esp32Error.model'); // ← agregar

function setupModels(sequelize) {
  // 1. Inicializar todos los modelos
  Bovine.init(BovineSchema, Bovine.config(sequelize));
  MilkProduction.init(MilkProductionSchema, MilkProduction.config(sequelize));
  BovineEvent.init(BovineEventSchema, BovineEvent.config(sequelize));
  MilkPrediction.init(MilkPredictionSchema, MilkPrediction.config(sequelize));
  Esp32Error.init(Esp32ErrorSchema, Esp32Error.config(sequelize)); // ← agregar

  // 2. Aplicar asociaciones
  Bovine.associate(sequelize.models);
  MilkProduction.associate(sequelize.models);
  BovineEvent.associate(sequelize.models);
  MilkPrediction.associate(sequelize.models);
  Esp32Error.associate(sequelize.models); // ← agregar
}

module.exports = setupModels;
