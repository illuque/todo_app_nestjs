import { Inject, Injectable } from '@nestjs/common';

import { TodoDB } from './todo.db';
import { TODO_REPOSITORY } from '../constants';
import { TodoRepository } from '../../../application/ports/todo.repository';

@Injectable()
export class TodoRepositoryDB implements TodoRepository {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: typeof TodoDB,
  ) {}

  async create(todo: TodoDB): Promise<TodoDB> {
    return await todo.save();
  }

  async findOne(id: number): Promise<TodoDB> {
    return await this.todoRepository.findOne<TodoDB>({ where: { id } });
  }
}
