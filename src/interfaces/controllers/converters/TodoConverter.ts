import { Todo } from '../../../domain/todo/Todo';
import { TodoREST } from '../dto/todo/TodoREST';

export class TodoRESTConverter {
  static from(todo: Todo): TodoREST {
    return new TodoREST(
      todo.id.value,
      todo.name,
      todo.date,
      todo.picture.value,
      todo.subTasks.map((t) => t.value),
    );
  }

  static fromMulti(todos: Todo[]): TodoREST[] {
    return todos.map((t) => this.from(t));
  }
}
