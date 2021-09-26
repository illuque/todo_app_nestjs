import { Injectable, Logger } from '@nestjs/common';
import { BaseOwnedTodoUseCase } from './common/BaseOwnedTodoUseCase';
import { TodoId } from '../../../domain/todo/TodoId';
import { UserId } from '../../../domain/user/UserId';
import { TodoRepositoryDB } from '../../../infrastructure/repositories/todo/TodoDBRepository';
import { TodoUnknownError } from './common/errors/TodoUnknownError';

@Injectable()
export class DeleteTodoUseCase extends BaseOwnedTodoUseCase<Input, void> {
  constructor(protected readonly todoRepository: TodoRepositoryDB) {
    super(todoRepository, new Logger(DeleteTodoUseCase.name));
  }

  async run(input: Input): Promise<void> {
    const todo = await this.findAndValidateOwner(input.todoId, input.userId);

    try {
      const deletedItems = await this.todoRepository.remove(todo.id);
      if (deletedItems === 1) {
        return;
      }
      this.logger.error(`Error removing Todo ${input.todoId}: repository returned ${deletedItems} deleted items`);
    } catch (e) {
      this.logger.error(`Error removing Todo ${input.todoId}: repository threw exception`, e.stack);
    }

    throw new TodoUnknownError('Unknown error deleting Todo');
  }
}

class Input {
  readonly todoId: TodoId;
  readonly userId: UserId;
}
