import { Inject, Injectable } from '@nestjs/common';

import { TodoDB } from './todo.db';
import { TODO_REPOSITORY } from '../constants';
import { RepositoryDB } from '../../../application/ports/repository.service';

@Injectable()
export class TodoRepositoryDB implements RepositoryDB<number, TodoDB> {
  // TODO:I extract interface
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: typeof TodoDB,
  ) {}

  async create(todo: TodoDB): Promise<TodoDB> {
    return await todo.save();
  }

  async findOne(id: number): Promise<TodoDB> {
    // TODO:I ver de llamar a los métodos estáticos en vez de a todoRepository
    return await this.todoRepository.findOne<TodoDB>({ where: { id } });
  }

  async findAllByCreator(createdBy: string): Promise<TodoDB[]> {
    // TODO:I ver de llamar a los métodos estáticos en vez de a todoRepository
    return await this.todoRepository.findAll<TodoDB>({ where: { createdBy } });
  }

  async remove(id: number): Promise<number> {
    // TODO:I ver de llamar a los métodos estáticos en vez de a todoRepository
    return await this.todoRepository.destroy<TodoDB>({ where: { id } });
  }

  async update(todoDB: TodoDB): Promise<TodoDB> {
    return todoDB.save();
  }
}
