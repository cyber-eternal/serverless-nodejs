import * as Sequelize from 'sequelize';
const config = require('../config');

const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
  host: config.database.host,
  port: config.database.port,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 50,
    min: 0,
    idle: 100000,
    acquire: 500000,
    acquireTimeout: 100000,
  }
});

export default sequelize;