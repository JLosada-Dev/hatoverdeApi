const { date, valid } = require('joi');
const { Model, DataTypes, Squelize } = require('sequelize');

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
    type: DataTypes.DATE,
    allowNull: false,
  },
  weigth_kg: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
  },
  sex: {
    type: DataTypes.ENUM('Macho', 'Hembra'),
    allowNull: false,
  },
  lactation_stage: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1, max: 5 },
  },
};

class Bovine extends Model {
  static associate(models) {
     this.hasMany(models.MilkProduction, {
       foreignKey: 'bovine_id',
       onDelete: 'CASCADE',
     });
     this.hasMany(models.BovineEvent, {
       foreignKey: 'bovine_id',
       onDelete: 'CASCADE',
     });
     this.hasMany(models.MilkPrediction, {
       foreignKey: 'bovine_id',
       onDelete: 'CASCADE',
     });
  }
  static config(squelize) {
    return {
      squelize,
      tableName: BOVINE_TABLE,
      modelName: 'Bovine',
      timestamps: true,

    };
  }
}
