const { Model, DataTypes } = require('sequelize');
const { BOVINE_TABLE } = require('./bovine.model');
const MILK_PRED_TABLE = 'milk_prediction';

const MilkPredictionSchema = {
  prediction_id: {
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
  prediction_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  predicted_week_start: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  predicted_week_end: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  predicted_milk_yield: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  prediction_accuracy: {
    type: DataTypes.DECIMAL(4, 2),
  },
};

class MilkPrediction extends Model {
  static associate(models) {
    this.belongsTo(models.Bovine, { foreignKey: 'bovine_id', as: 'bovine' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MILK_PRED_TABLE,
      modelName: 'MilkPrediction',
      timestamps: true,
      underscored: true,
      indexes: [
        { unique: true, fields: ['bovine_id', 'predicted_week_start'] },
      ],
    };
  }
}

module.exports = { MILK_PRED_TABLE, MilkPredictionSchema, MilkPrediction };
