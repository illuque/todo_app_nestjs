import { DATABASE, DIALECT, HOST, PASSWORD, PORT, USERNAME } from './constants';

module.exports = {
  development: {
    dialect: DIALECT,
    host: HOST,
    port: PORT,
    username: USERNAME,
    password: PASSWORD,
    database: DATABASE,
  },
};
