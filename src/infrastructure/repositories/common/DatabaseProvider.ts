import { Sequelize } from 'sequelize-typescript';
import { TodoDB } from '../todo/TodoDB';

import { UserDB } from '../user/UserDB';

export const databaseProvider = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
      });
      sequelize.addModels([TodoDB, UserDB]);
      //await sequelize.sync();
      return sequelize;
    },
  },
];
