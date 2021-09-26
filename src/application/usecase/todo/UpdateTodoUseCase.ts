import { Injectable, Logger } from '@nestjs/common';
import { TodoRepositoryDB } from '../../../infrastructure/repositories/todo/TodoDBRepository';
import { Todo } from '../../../domain/todo/Todo';
import { BaseOwnedTodoUseCase } from './common/BaseOwnedTodoUseCase';
import { TodoId } from '../../../domain/todo/TodoId';
import { UserId } from '../../../domain/user/UserId';
import { TodoUnknownError } from './common/errors/TodoUnknownError';

@Injectable()
export class UpdateTodoUseCase extends BaseOwnedTodoUseCase<Input, Todo> {
  constructor(protected readonly todoRepository: TodoRepositoryDB) {
    super(todoRepository, new Logger(UpdateTodoUseCase.name));
  }

  async run(input: Input): Promise<Todo> {
    const todo = await this.findAndValidateOwner(input.todoId, input.userId);

    if (input.newName) {
      todo.changeName(input.newName);
    }

    if (input.newDate) {
      todo.changeDate(input.newDate);
    }

    return await this.updateOnDB(todo, input.todoId, input.userId);
  }

  private async updateOnDB(todo: Todo, todoId: TodoId, userId: UserId) {
    try {
      return await this.todoRepository.update(todo);
    } catch (e) {
      this.logger.error(
        `Unknown error updating Todo ${todoId} for user ${userId}: repository threw exception"`,
        e.stack,
      );
      throw new TodoUnknownError('Unknown error updating Todo');
    }
  }
}

class Input {
  readonly todoId: TodoId;
  readonly userId: UserId;
  readonly newName: string;
  readonly newDate: Date;
}
