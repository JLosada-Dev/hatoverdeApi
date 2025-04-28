const { Model, DataTypes, Sequelize } = require('sequelize');

const MILK_PROD_TABLE = 'milk_production';

const MilkProductionSchema = {
  production_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  bovine_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bovine',
      key: 'bovine_id',
    },
    onDelete: 'CASCADE',
  },
  milking_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  milk_yield: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  milk_fat: {
    type: DataTypes.DECIMAL(3, 1),
  },
  milk_protein: {
    type: DataTypes.DECIMAL(3, 1),
  },
};

class MilkProduction extends Model {
  static associate(models) {
    this.belongsTo(models.Bovine, { foreignKey: 'bovine_id', as: 'bovine' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MILK_PROD_TABLE,
      modelName: 'MilkProduction',
      timestamps: false,
    };
  }
}

module.exports = { MILK_PROD_TABLE, MilkProductionSchema, MilkProduction };
