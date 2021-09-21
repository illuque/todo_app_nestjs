import { UserDB } from './user.db';
import { USER_REPOSITORY } from '../constants';

export const userDatabaseProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: UserDB,
  },
];
