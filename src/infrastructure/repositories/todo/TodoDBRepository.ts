import { Inject, Injectable } from '@nestjs/common';

import { TodoDB } from './TodoDB';
import { TODO_REPOSITORY } from '../common/DBConstants';
import { RepositoryDB } from '../../../application/ports/RepositoryService';
import sequelize, { ValidationError } from 'sequelize';
import { TodoId } from '../../../domain/vo/TodoId';
import { UserId } from '../../../domain/vo/UserId';
import { Task } from '../../../domain/Task';
import { Todo } from '../../../domain/todo/Todo';
import { TodoDBConverter } from './TodoDBConverter';

@Injectable()
export class TodoRepositoryDB implements RepositoryDB<TodoId, Todo> {
  // TODO:I extract interface
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: typeof TodoDB,
  ) {}

  async create(todo: Todo): Promise<Todo> {
    let todoDB = TodoDBConverter.toDBNew(todo);
    todoDB = await todoDB.save();
    return todoDB && TodoDBConverter.fromDB(todoDB);
  }

  async findOne(todoId: TodoId): Promise<Todo> {
    const todoDB = await TodoDB.findOne({ where: { id: todoId.value } });
    return todoDB && TodoDBConverter.fromDB(todoDB);
  }

  async findAllByCreator(userId: UserId): Promise<Todo[]> {
    const todosDB = await TodoDB.findAll({ where: { createdBy: userId.value } });
    // TODO:I check if when none found it returns an array
    return todosDB && TodoDBConverter.fromDBMulti(todosDB);
  }

  async remove(todoId: TodoId): Promise<number> {
    return await TodoDB.destroy({ where: { id: todoId.value } });
  }

  async update(todo: Todo): Promise<Todo> {
    let todoDB = await TodoDB.findOne({ where: { id: todo.id.value } });
    if (!todoDB) {
      throw new ValidationError('Todo to update not found');
    }

    todoDB = TodoDBConverter.toDBMergeExisting(todo, todoDB);
    todoDB = await todoDB.save();
    if (!todoDB) {
      throw new ValidationError('Todo to update not found');
    }

    return todoDB && TodoDBConverter.fromDB(todoDB);
  }

  async addTask(todoId: TodoId, task: Task): Promise<Todo> {
    const [rowsUpdated, affectedRows] = await this.todoRepository.update<TodoDB>(
      {
        subTasks: sequelize.fn('array_append', sequelize.col('subTasks'), task.value),
      },
      { where: { id: todoId.value }, returning: true },
    );

    if (rowsUpdated === 0) {
      throw new ValidationError('No affected items adding task');
    }

    const todoDB = affectedRows[0];
    if (!todoDB) {
      throw new ValidationError('Null affected item');
    }

    return TodoDBConverter.fromDB(todoDB);
  }
}
