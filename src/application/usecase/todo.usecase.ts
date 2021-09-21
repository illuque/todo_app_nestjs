import { Injectable } from '@nestjs/common';
import { TodoDB } from '../../infrastructure/repositories/todo/todo.db';
import { Todo } from '../../domain/todo';
import { TodoRepositoryDB } from '../../infrastructure/repositories/todo/todo.db.repository';
import { TodoDeleteResult } from '../dto/todo.delete-result';

@Injectable()
export class TodoUseCase {
  constructor(private readonly todoRepository: TodoRepositoryDB) {}

  async create(userId: string, todo: Todo): Promise<Todo> {
    // TODO:I create mapper for this
    const todoDB = new TodoDB();

    todoDB.name = todo.name;
    todoDB.date = todo.date;
    todoDB.picture = todo.picture;
    todoDB.subTasks = todo.subTasks;

    todoDB.createdBy = userId;

    const newTodoDB = await this.todoRepository.create(todoDB);

    // TODO:I create mapper for this
    return new Todo(
      newTodoDB.id,
      newTodoDB.name,
      newTodoDB.date,
      newTodoDB.picture,
      newTodoDB.createdBy,
      newTodoDB.subTasks,
    );
  }

  async findAllByCreator(createdBy: string): Promise<Todo[]> {
    const todosDB = await this.todoRepository.findAllByCreator(createdBy);

    if (!todosDB.length) {
      return [];
    }

    // TODO:I create mapper for this
    return todosDB.map(
      (todoDB) =>
        new Todo(
          todoDB.id,
          todoDB.name,
          todoDB.date,
          todoDB.picture,
          todoDB.createdBy,
          todoDB.subTasks,
        ),
    );
  }

  async deleteById(id: number, createdBy: string): Promise<TodoDeleteResult> {
    const todoDB = await this.todoRepository.findOne(id);
    if (!todoDB) {
      return TodoDeleteResult.NokNotFound;
    }

    if (todoDB.createdBy !== createdBy) {
      return TodoDeleteResult.NokForbidden;
    }

    const affectedRows = await this.todoRepository.remove(id);
    if (!affectedRows) {
      return TodoDeleteResult.UnknownError;
    }

    return TodoDeleteResult.Ok;
  }
}
