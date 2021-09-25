import { UserDB } from './UserDB';
import { USER_REPOSITORY } from '../common/DBConstants';

export const userDatabaseProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: UserDB,
  },
];
