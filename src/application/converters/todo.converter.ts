import { Todo } from '../../domain/todo';
import { TodoDB } from '../../infrastructure/repositories/todo/todo.db';

export class TodoConverter {
  private constructor() {}

  static fromDB(todoDB: TodoDB): Todo {
    return new Todo(
      todoDB.id,
      todoDB.name,
      todoDB.date,
      todoDB.picture,
      todoDB.createdBy,
      todoDB.subTasks,
    );
  }

  static toDB(todo: Todo, userId: string): TodoDB {
    const todoDB = new TodoDB();
    todoDB.id = todo.id;
    todoDB.name = todo.name;
    todoDB.date = todo.date;
    todoDB.picture = todo.picture;
    todoDB.subTasks = todo.subTasks;

    todoDB.createdBy = userId;

    return todoDB;
  }
}
