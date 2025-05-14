const { Model, DataTypes } = require('sequelize');
const BOVINE_TABLE = 'bovine';

const BovineSchema = {
  bovine_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  ear_tag: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  breed: {
    type: DataTypes.ENUM('Holstein', 'Ayrshire', 'Jersey'),
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  weight_kg: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
  },
  sex: {
    type: DataTypes.ENUM('Male', 'Female'),
    allowNull: false,
  },
  lactation_stage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 5 },
  },
  daily_goal: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 20,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
};

class Bovine extends Model {
  static associate(models) {
    this.hasMany(models.MilkProduction, {
      foreignKey: 'bovine_id',
      as: 'productions',
      onDelete: 'CASCADE',
    });
    this.hasMany(models.BovineEvent, {
      foreignKey: 'bovine_id',
      as: 'events',
      onDelete: 'CASCADE',
    });
    this.hasMany(models.MilkPrediction, {
      foreignKey: 'bovine_id',
      as: 'predictions',
      onDelete: 'CASCADE',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: BOVINE_TABLE,
      modelName: 'Bovine',
      timestamps: true,
      underscored: true,
      indexes: [
        // ya tienes unique en ear_tag, pero lo reiteramos:
        { unique: true, fields: ['ear_tag'] },
        // índices de filtro:
        { fields: ['is_active'] },
        { fields: ['breed'] },
        { fields: ['date_of_birth'] },
        { fields: ['lactation_stage'] },
        { fields: ['sex'] },
      ],
    };
  }
}

module.exports = { BOVINE_TABLE, BovineSchema, Bovine };
