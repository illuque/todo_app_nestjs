import { Injectable, Logger } from '@nestjs/common';
import { BaseOwnedTodoUseCase } from './common/BaseOwnedTodoUseCase';
import { Todo } from '../../../domain/todo/Todo';
import { TodoId } from '../../../domain/todo/TodoId';
import { UserId } from '../../../domain/user/UserId';
import { Task } from '../../../domain/task/Task';
import { TodoRepositoryDB } from '../../../infrastructure/repositories/todo/TodoDBRepository';
import { TodoUnknownError } from './common/errors/TodoUnknownError';

@Injectable()
export class AddTaskToTodoUseCase extends BaseOwnedTodoUseCase<Input, Todo> {
  constructor(protected readonly todoRepository: TodoRepositoryDB) {
    super(todoRepository, new Logger(AddTaskToTodoUseCase.name));
  }

  async run(input: Input): Promise<Todo> {
    const todo = await this.findAndValidateOwner(input.todoId, input.userId);

    todo.addTask(input.task);

    const todoUpdated = await this.addTaskInRepository(input.todoId, input.task, input.userId);
    if (!todoUpdated) {
      throw new TodoUnknownError('Unknown error adding task to Todo');
    }

    return todoUpdated;
  }

  private async addTaskInRepository(todoId: TodoId, task: Task, userId: UserId): Promise<Todo> {
    try {
      return await this.todoRepository.addTask(todoId, task);
    } catch (e) {
      this.logger.error(
        `Unknown error adding task to Todo ${todoId} for user ${userId}: repository threw exception"`,
        e.stack,
      );
    }

    return null;
  }
}

class Input {
  readonly todoId: TodoId;
  readonly userId: UserId;
  readonly task: Task;
}
