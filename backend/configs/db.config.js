// eslint-disable-next-line
require('dotenv').config();

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: true,
};

module.exports = {
  local: dbConfig,
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
  staging: dbConfig,
};
