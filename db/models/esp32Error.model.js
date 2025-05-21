// db/models/esp32Error.model.js
const { Model, DataTypes } = require('sequelize');
const { MILK_PROD_TABLE } = require('./milkProduction.model');
const ESP32_TABLE = 'esp32_errors';

const Esp32ErrorSchema = {
  error_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  production_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: MILK_PROD_TABLE,
      key: 'production_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  error_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
};

class Esp32Error extends Model {
  static associate(models) {
    this.belongsTo(models.MilkProduction, {
      foreignKey: 'production_id',
      as: 'production',
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: ESP32_TABLE,
      modelName: 'Esp32Error',
      timestamps: true,
      underscored: true,
    };
  }
}

module.exports = { ESP32_TABLE, Esp32ErrorSchema, Esp32Error };
