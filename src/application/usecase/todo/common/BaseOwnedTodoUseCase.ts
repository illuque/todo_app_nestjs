import { Todo } from '../../../../domain/todo/Todo';
import { UserId } from '../../../../domain/vo/UserId';
import { TodoId } from '../../../../domain/vo/TodoId';
import { TodoRepositoryDB } from '../../../../infrastructure/repositories/todo/TodoDBRepository';
import { TodoUseCase } from './TodoUseCase';
import { Logger } from '@nestjs/common';
import { TodoNotFoundError } from './errors/TodoNotFoundError';
import { UserNotOwnerError } from './errors/UserNotOwnerError';
import { TodoUnknownError } from './errors/TodoUnknownError';

export abstract class BaseOwnedTodoUseCase<Input, Output> implements TodoUseCase<Input, Output> {
  abstract run(input: Input): Promise<Output>;

  protected constructor(protected readonly todoRepository: TodoRepositoryDB, protected readonly logger: Logger) {}

  protected async findAndValidateOwner(todoId: TodoId, userId: UserId): Promise<Todo> {
    const todo = await this.findOnDB(todoId);
    if (!todo) {
      throw new TodoNotFoundError('Todo not found');
    }

    this.validateOwner(todo, userId);

    return todo;
  }

  private findOnDB(todoId: TodoId): Promise<Todo> {
    try {
      return this.todoRepository.findOne(todoId);
    } catch (e) {
      this.logger.error(`Error getting Todo ${todoId} from repository`);
      throw new TodoUnknownError('Unknown error deleting Todo');
    }
  }

  private validateOwner(todo: Todo, userId: UserId) {
    if (!todo?.createdBy.equals(userId)) {
      throw new UserNotOwnerError(`User is not Todo's owner`);
    }
  }
}
