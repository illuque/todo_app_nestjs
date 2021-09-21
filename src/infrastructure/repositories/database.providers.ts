import { Sequelize } from 'sequelize-typescript';
import { TodoDB } from './todo/todo.db';

import { UserDB } from './user/user.db';
import { DATABASE, DIALECT, HOST, PASSWORD, PORT, USERNAME } from './constants';

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
      sequelize.addModels([TodoDB, UserDB]);
      //await sequelize.sync();
      return sequelize;
    },
  },
];
