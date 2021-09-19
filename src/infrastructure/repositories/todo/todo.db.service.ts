import { Injectable, Inject } from '@nestjs/common';

import { TodoDB } from './todo.db';
import { TODO_REPOSITORY } from '../constants';

@Injectable()
export class TodoDatabaseService {
  constructor(
    @Inject(TODO_REPOSITORY) private readonly todoRepository: typeof TodoDB,
  ) {}

  async create(todo: Todo): Promise<TodoDB> {
    return await this.todoRepository.create<TodoDB>(todo);
  }

  async findOneById(id: number): Promise<TodoDB> {
    return await this.todoRepository.findOne<TodoDB>({ where: { id } });
  }
}
