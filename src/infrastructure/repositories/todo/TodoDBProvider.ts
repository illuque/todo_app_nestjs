import { TodoDB } from './TodoDB';
import { TODO_REPOSITORY } from '../common/DBConstants';

export const todoDatabaseProviders = [
  {
    provide: TODO_REPOSITORY,
    useValue: TodoDB,
  },
];
