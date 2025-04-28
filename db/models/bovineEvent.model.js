const { Model, DataTypes } = require('sequelize');
const { BOVINE_TABLE } = require('./bovine.model');
const BOVINE_EVENT_TABLE = 'bovine_event';

const BovineEventSchema = {
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  bovine_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BOVINE_TABLE,
      key: 'bovine_id',
    },
    onDelete: 'CASCADE',
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  event_category: {
    type: DataTypes.ENUM('Health', 'Reproduction'),
    allowNull: false,
  },
  event_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('Mild', 'Moderate', 'Severe'),
  },
  result: {
    type: DataTypes.ENUM('Positive', 'Negative', 'Unknown'),
  },
  lactation_affected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  notes: {
    type: DataTypes.TEXT,
  },
};

class BovineEvent extends Model {
  static associate(models) {
    this.belongsTo(models.Bovine, { foreignKey: 'bovine_id', as: 'bovine' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: BOVINE_EVENT_TABLE,
      modelName: 'BovineEvent',
      timestamps: true,
      underscored: true,
      indexes: [{ fields: ['bovine_id', 'event_date'] }],
    };
  }
}

module.exports = { BOVINE_EVENT_TABLE, BovineEventSchema, BovineEvent };
