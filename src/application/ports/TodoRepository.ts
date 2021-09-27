import { Todo } from '../../domain/todo/Todo';
import { TodoId } from '../../domain/todo/TodoId';
import { UserId } from '../../domain/user/UserId';
import { Task } from '../../domain/task/Task';

export interface TodoRepository {
  create(todo: Todo): Promise<Todo>;

  findOne(todoId: TodoId): Promise<Todo>;

  findAllByCreator(userId: UserId): Promise<Todo[]>;

  remove(todoId: TodoId): Promise<number>;

  update(todo: Todo): Promise<Todo>;

  addTask(todoId: TodoId, task: Task): Promise<Todo>;
}
