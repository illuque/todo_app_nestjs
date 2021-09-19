import { TodoDB } from './todo.db';
import { TODO_REPOSITORY } from '../constants';

export const todoDatabaseProviders = [
  {
    provide: TODO_REPOSITORY,
    useValue: TodoDB,
  },
];
