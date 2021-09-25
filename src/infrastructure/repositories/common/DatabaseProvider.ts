import { Sequelize } from 'sequelize-typescript';
import { TodoDB } from '../todo/TodoDB';

import { UserDB } from '../user/UserDB';
import { DATABASE, DIALECT, HOST, PASSWORD, PORT, USERNAME } from './DBConstants';

export const databaseProvider = [
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
