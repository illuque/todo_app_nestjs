import { Todo } from '../../../domain/todo/Todo';
import { Injectable, Logger } from '@nestjs/common';
import { TodoRepositoryDB } from '../../../infrastructure/repositories/todo/TodoDBRepository';
import { UserId } from '../../../domain/user/UserId';
import { TodoUseCase } from './common/TodoUseCase';
import { TodoUnknownError } from './common/errors/TodoUnknownError';

@Injectable()
export class GetAllTodosByUserUseCase implements TodoUseCase<UserId, Todo[]> {
  private readonly logger = new Logger(GetAllTodosByUserUseCase.name);

  constructor(private readonly todoRepository: TodoRepositoryDB) {}

  async run(userId: UserId): Promise<Todo[]> {
    try {
      const todos = await this.todoRepository.findAllByCreator(userId);
      return todos || [];
    } catch (e) {
      this.logger.error('Error getting user Todos', e.stack);
      throw new TodoUnknownError('Unknown error getting user Todos');
    }
  }
}
