import { Injectable, Logger } from '@nestjs/common';
import { TodoRepositoryDB } from '../../../infrastructure/repositories/todo/TodoDBRepository';
import { BaseOwnedTodoUseCase } from './common/BaseOwnedTodoUseCase';
import { Todo } from '../../../domain/todo/Todo';
import { TodoId } from '../../../domain/vo/TodoId';
import { UserId } from '../../../domain/vo/UserId';
import { Picture } from '../../../domain/Picture';
import { TodoUnknownError } from './common/errors/TodoUnknownError';

@Injectable()
export class UploadPictureToTodoUseCase extends BaseOwnedTodoUseCase<Input, Todo> {
  constructor(protected readonly todoRepository: TodoRepositoryDB) {
    super(todoRepository, new Logger(UploadPictureToTodoUseCase.name));
  }

  async run(input: Input): Promise<Todo> {
    const todo = await this.findAndValidateOwner(input.todoId, input.userId);

    todo.setPicture(input.picture);

    return await this.setPictureOnDB(todo, input.todoId, input.userId);
  }

  private async setPictureOnDB(todo: Todo, todoId: TodoId, userId: UserId) {
    try {
      return await this.todoRepository.update(todo);
    } catch (e) {
      this.logger.error(
        `Unknown error setting picture to Todo ${todoId} for user ${userId}: repository threw exception"`,
        e,
      );
      throw new TodoUnknownError('Unknown error setting picture to Todo');
    }
  }
}

class Input {
  readonly todoId: TodoId;
  readonly userId: UserId;
  readonly picture: Picture;
}
