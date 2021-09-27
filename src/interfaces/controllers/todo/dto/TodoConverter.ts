import { Todo } from '../../../../domain/todo/Todo';
import { TodoREST } from './TodoREST';
import { PICTURES_PATH } from '../../../../infrastructure/file/FileConstants';

export class TodoRESTConverter {
  static from(todo: Todo): TodoREST {
    return new TodoREST(
      todo.id.value,
      todo.name,
      todo.date,
      todo.picture.value ? `/${PICTURES_PATH}/${todo.picture.value}` : null,
      todo.subTasks.map((t) => t.value),
    );
  }

  static fromMulti(todos: Todo[]): TodoREST[] {
    return todos.map((t) => this.from(t));
  }
}
