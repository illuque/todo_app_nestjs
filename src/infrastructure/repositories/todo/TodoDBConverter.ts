import { Picture } from '../../../domain/picture/Picture';
import { Task } from '../../../domain/task/Task';
import { Todo } from '../../../domain/todo/Todo';
import { TodoDB } from './TodoDB';
import { UserId } from '../../../domain/user/UserId';
import { TodoId } from '../../../domain/todo/TodoId';

export class TodoDBConverter {
  static fromDB(todoDB: TodoDB): Todo {
    return Todo.createExisting(
      new TodoId(todoDB.id),
      todoDB.name,
      todoDB.date,
      new Picture(todoDB.picture),
      new UserId(todoDB.createdBy),
      todoDB.subTasks.map((t) => new Task(t)),
    );
  }

  static fromDBMulti(todosDB: TodoDB[]): Todo[] {
    return todosDB.map((t) => this.fromDB(t));
  }

  static toDBNew(todo: Todo): TodoDB {
    const todoDB = new TodoDB();
    this.merge(todoDB, todo);
    return todoDB;
  }

  static toDBMergeExisting(todo: Todo, todoDB: TodoDB): TodoDB {
    this.merge(todoDB, todo);
    return todoDB;
  }

  private static merge(todoDB: TodoDB, todo: Todo) {
    todoDB.id = todo.id?.value;
    todoDB.name = todo.name;
    todoDB.date = todo.date;
    todoDB.picture = todo.picture?.value;
    todoDB.subTasks = todo.subTasks?.map((t) => t.value) || [];
    todoDB.createdBy = todo.createdBy.value;
  }
}
