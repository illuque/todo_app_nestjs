import { Injectable } from '@nestjs/common';
import { Todo } from '../../../domain/todo';
import { TodoRepositoryDB } from '../../../infrastructure/repositories/todo/todo.db.repository';
import { TodoUseCaseDeleteResultDto } from './dto/todo.usecase.delete-result.dto';
import { TodoUseCaseResult } from './dto/todo.usecase.result';
import { TodoConverter } from '../../converters/todo.converter';

@Injectable()
export class TodoUseCase {
  // TODO:I Dividir en varias clases
  constructor(private readonly todoRepository: TodoRepositoryDB) {}

  // TODO:I create usecase DTO
  async create(loggedUserId: string, todo: Todo): Promise<Todo> {
    const todoDB = TodoConverter.toDB(todo, loggedUserId);
    const todoDBCreated = await this.todoRepository.create(todoDB); // TODO:I catch possible exception?
    return TodoConverter.fromDB(todoDBCreated);
  }

  async findAllByCreator(createdBy: string): Promise<Todo[]> {
    const todosDB = await this.todoRepository.findAllByCreator(createdBy);
    return todosDB.map((todoDB) => TodoConverter.fromDB(todoDB));
  }

  async deleteById(
    id: number,
    loggedUserId: string,
  ): Promise<TodoUseCaseDeleteResultDto> {
    const todoDB = await this.todoRepository.findOne(id);
    if (!todoDB) {
      return TodoUseCaseDeleteResultDto.CreateErrorNotFound();
    }

    if (todoDB.createdBy !== loggedUserId) {
      return TodoUseCaseDeleteResultDto.CreateErrorForbidden();
    }

    const affectedRows = await this.todoRepository.remove(id);
    if (!affectedRows) {
      return TodoUseCaseDeleteResultDto.CreateErrorUnknown();
    }

    return TodoUseCaseDeleteResultDto.CreateOk();
  }

  async update(
    todoId: number,
    loggedUserId: string,
    todo: Todo,
  ): Promise<TodoUseCaseResult> {
    const todoDB = await this.todoRepository.findOne(todoId);

    if (!todoDB) {
      return TodoUseCaseResult.CreateErrorNotFound();
    }

    if (todoDB.createdBy !== loggedUserId) {
      return TodoUseCaseResult.CreateErrorForbidden();
    }

    todoDB.name = todo.name || todoDB.name;
    todoDB.picture = todo.picture || todoDB.picture;
    todoDB.date = todo.date || todoDB.date;

    const todoDBUpdated = await this.todoRepository.update(todoDB);
    if (!todoDBUpdated) {
      return TodoUseCaseResult.CreateErrorUnknown();
    }

    const todoUpdated = TodoConverter.fromDB(todoDBUpdated);

    return TodoUseCaseResult.CreateOk(todoUpdated);
  }
}
