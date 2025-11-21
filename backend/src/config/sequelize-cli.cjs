require('dotenv').config();

const commonSqlite = {
  dialect: 'sqlite',
  storage: process.env.SQLITE_STORAGE || './dev.sqlite',
  logging: false,
};

module.exports = {
  development: commonSqlite,
  test: {
    ...commonSqlite,
    storage: process.env.SQLITE_TEST_STORAGE || './test.sqlite',
  },
  production: {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
  },
};
