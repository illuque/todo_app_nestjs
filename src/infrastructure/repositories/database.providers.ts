import { Sequelize } from 'sequelize-typescript';
import { TodoDB } from './todo/todo.db';
import {
  DATABASE,
  DIALECT,
  HOST,
  PASSWORD,
  PORT,
  USERNAME,
} from '../setup/postgres/constants';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: DIALECT,
        host: HOST,
        port: PORT,
        username: USERNAME,
        password: PASSWORD,
        database: DATABASE,
      });
      sequelize.addModels([TodoDB]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
