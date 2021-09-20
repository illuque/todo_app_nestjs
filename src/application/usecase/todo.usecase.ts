import { Injectable } from '@nestjs/common';
import { TodoDB } from '../../infrastructure/repositories/todo/todo.db';
import { Todo } from '../../domain/todo';
import { TodoRepository } from '../ports/todo.repository';

@Injectable()
export class TodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(todo: Todo): Promise<Todo> {
    // TODO:I create mapper for this
    const todoDB = new TodoDB();
    todoDB.name = todo.name;
    todoDB.date = todo.date;
    todoDB.picture = todo.picture;
    todoDB.createdBy = todo.createdBy;
    todoDB.subTasks = todo.subTasks;

    const newTodoDB = await this.todoRepository.create(todoDB);

    // TODO:I create mapper for this
    return new Todo(
      newTodoDB.name,
      newTodoDB.date,
      newTodoDB.picture,
      newTodoDB.createdBy,
      newTodoDB.subTasks,
    );
  }

  async findOneById(id: number): Promise<Todo> {
    const todoDB = await this.todoRepository.findOne(id);

    // TODO:I create mapper for this
    return new Todo(
      todoDB.name,
      todoDB.date,
      todoDB.picture,
      todoDB.createdBy,
      todoDB.subTasks,
    );
  }
}