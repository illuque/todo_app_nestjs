import { Injectable, Logger } from '@nestjs/common';
import { Todo } from '../../../domain/todo';
import { TodoRepositoryDB } from '../../../infrastructure/repositories/todo/todo.db.repository';
import { TodoConverter } from '../../converters/todo.converter';
import { TodoDB } from '../../../infrastructure/repositories/todo/todo.db';
import {
  TodoNotFoundError,
  TodoUnknownError,
  TodoNotOwnedByUserError,
  TodoNotUpdatableError,
} from './todo.usecase.errors';

@Injectable()
export class TodoUseCase {
  private readonly logger = new Logger(TodoUseCase.name);

  // TODO:I Dividir en varias clases
  constructor(private readonly todoRepository: TodoRepositoryDB) {}

  // TODO:I create usecase DTO
  async create(loggedUserId: string, todo: Todo): Promise<Todo> {
    // TODO:I validate required fields on input

    const todoDB = TodoConverter.toDB(todo, loggedUserId);
    try {
      const todoDBCreated = await this.todoRepository.create(todoDB); // TODO:I catch possible exceptions here and everywhere?
      return TodoConverter.fromDB(todoDBCreated);
    } catch (e) {
      this.logger.error('Error creating Todo', e);
      throw new TodoUnknownError('Unknown error creating Todo');
    }
  }

  async findAllByCreator(userId: string): Promise<Todo[]> {
    try {
      const todosDB = await this.todoRepository.findAllByCreator(userId);
      return todosDB.map((todoDB) => TodoConverter.fromDB(todoDB));
    } catch (e) {
      this.logger.error('Error getting user Todos', e);
      throw new TodoUnknownError(`Unknown error getting user ${userId} Todos`);
    }
  }

  async deleteById(id: number, userId: string): Promise<void> {
    let todoDB;
    try {
      todoDB = await this.todoRepository.findOne(id);
    } catch (e) {
      this.logger.error(`Error getting Todo ${id} from user ${userId} before deleting`);
      throw new TodoUnknownError('Unknown error deleting Todo');
    }

    TodoUseCase.validateOwner(todoDB, userId);

    const affectedRows = await this.todoRepository.remove(id);
    if (affectedRows === 0) {
      this.logger.error(`Unknown error deleting Todo ${id} from user ${userId}, it should exist after previous find`);
      throw new TodoUnknownError('Unknown error deleting Todo');
    }

    return;
  }

  async update(id: number, userId: string, todo: Todo): Promise<Todo> {
    // TODO:I DTO
    // TODO:I validate required fields on input
    let todoDB;
    try {
      todoDB = await this.todoRepository.findOne(id);
    } catch (e) {
      this.logger.error(`Unknown error getting Todo ${id} from user ${userId} for update`);
      throw new TodoUnknownError(`Unknown error updating Todo`);
    }

    TodoUseCase.validateOwner(todoDB, userId);

    todoDB.name = todo.name || todoDB.name;
    todoDB.picture = todo.picture || todoDB.picture;
    todoDB.date = todo.date || todoDB.date;

    let todoDBUpdated;
    try {
      todoDBUpdated = await this.todoRepository.update(todoDB);
      if (!todoDBUpdated) {
        this.logger.error(`Unknown error updating Todo ${id} from user ${userId}: repository returned "no update"`);
      }
    } catch (e) {
      this.logger.error(`Unknown error updating Todo ${id} from user ${userId}: repository threw exception"`, e);
    }

    if (!todoDBUpdated) {
      throw new TodoUnknownError(`Unknown error updating Todo`);
    }

    return TodoConverter.fromDB(todoDBUpdated);
  }

  async addTask(id: number, userId: string, task: string) {
    let todoDB;
    try {
      todoDB = await this.todoRepository.findOne(id);
    } catch (e) {
      this.logger.error(`Unknown error getting Todo ${id} from user ${userId} for addTask`);
      throw new TodoUnknownError(`Unknown error adding task to Todo`);
    }

    TodoUseCase.validateOwner(todoDB, userId);

    if (todoDB.subTasks.includes(task)) {
      throw new TodoNotUpdatableError('Duplicated task');
    }

    let todoDBUpdated;
    try {
      todoDBUpdated = await this.todoRepository.addTask(id, task);
      if (!todoDBUpdated) {
        this.logger.error(
          `Unknown error adding task to Todo ${id} from user ${userId}: repository returned "no update"`,
        );
      }
    } catch (e) {
      this.logger.error(`Unknown error updating Todo ${id} from user ${userId}: repository threw exception"`, e);
    }

    if (!todoDBUpdated) {
      throw new TodoUnknownError('Unknown error adding task to Todo');
    }
  }

  async setPicture(id: number, userId: string, pictureId: string) {
    let todoDB;
    try {
      todoDB = await this.todoRepository.findOne(id);
    } catch (e) {
      this.logger.error(`Unknown error getting Todo ${id} from user ${userId} for setPicture`);
      throw new TodoUnknownError(`Unknown error setting picture to Todo`);
    }

    TodoUseCase.validateOwner(todoDB, userId);

    todoDB.picture = pictureId;

    let todoDBUpdated;
    try {
      todoDBUpdated = await this.todoRepository.update(todoDB);
      if (!todoDBUpdated) {
        this.logger.error(
          `Unknown error setting picture to Todo ${id} from user ${userId}: repository returned "no update"`,
        );
      }
    } catch (e) {
      this.logger.error(
        `Unknown error setting picture to Todo ${id} from user ${userId}: repository threw exception"`,
        e,
      );
    }

    if (!todoDBUpdated) {
      throw new TodoUnknownError('Unknown error setting picture to Todo');
    }
  }

  private static validateOwner(todoDB: TodoDB, userId: string) {
    if (!todoDB) {
      throw new TodoNotFoundError(`Could not find Todo ${todoDB.id}`);
    }

    if (todoDB.createdBy !== userId) {
      throw new TodoNotOwnedByUserError(`User ${userId} does not own ${todoDB.id}`);
    }

    return null;
  }
}
