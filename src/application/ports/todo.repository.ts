import { TodoDB } from '../../infrastructure/repositories/todo/todo.db';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class TodoRepository {
  abstract create(todo: TodoDB): Promise<TodoDB>;

  abstract findOne(id: number): Promise<TodoDB>;
}
