const { Sequelize } = require('sequelize');

const { config } = require('../config');

const setupModels = require('../db/models');

const options = {
  dialect: 'mysql',
  logging: config.isProd ? false : true,
}

if(config.isProd){
  options.dialectOptions ={
    ssl: {
      rejectUnauthorized: false,
    }
  }
}

const sequelize = new Sequelize(config.dbUrl, options)