import { Todo } from '../../../domain/todo/Todo';
import { Injectable, Logger } from '@nestjs/common';
import { TodoRepositoryDB } from '../../../infrastructure/repositories/todo/TodoDBRepository';
import { UserId } from '../../../domain/user/UserId';
import { TodoUseCase } from './common/TodoUseCase';
import { TodoUnknownError } from './common/errors/TodoUnknownError';

@Injectable()
export class CreateTodoUseCase implements TodoUseCase<Input, Todo> {
  private readonly logger = new Logger(CreateTodoUseCase.name);

  constructor(private readonly todoRepository: TodoRepositoryDB) {}

  async run(input: Input): Promise<Todo> {
    try {
      const todo = Todo.createNew(input.name, input.date, input.userId);
      return await this.todoRepository.create(todo);
    } catch (e) {
      this.logger.error('Error creating Todo', e.stack);
      throw new TodoUnknownError('Unknown error creating Todo');
    }
  }
}

class Input {
  readonly userId: UserId;
  readonly name: string;
  readonly date: Date;
}
