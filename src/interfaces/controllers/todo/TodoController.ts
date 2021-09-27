import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AddTaskTodoInput } from './dto/AddTaskTodoInput';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTodoUseCase } from '../../../application/usecase/todo/CreateTodoUseCase';
import { GetAllTodosByUserUseCase } from '../../../application/usecase/todo/GetAllTodosByUserUseCase';
import { DeleteTodoUseCase } from '../../../application/usecase/todo/DeleteTodoUseCase';
import { AddTaskToTodoUseCase } from '../../../application/usecase/todo/AddTaskToTodoUseCase';
import { UpdateTodoUseCase } from '../../../application/usecase/todo/UpdateTodoUseCase';
import { UploadPictureToTodoUseCase } from '../../../application/usecase/todo/UploadPictureToTodoUseCase';
import { UserId } from '../../../domain/user/UserId';
import { TodoId } from '../../../domain/todo/TodoId';
import { Task } from '../../../domain/task/Task';
import { Picture } from '../../../domain/picture/Picture';
import { CreateOrUpdateTodoInput } from './dto/CreateOrUpdateTodoInput';
import { TodoREST } from './dto/TodoREST';
import { TodoRESTConverter } from './dto/TodoConverter';
import { PictureFileStore } from '../../../infrastructure/file/PictureFileStore';
import { HttpErrorHandler } from '../common/HttpErrorHandler';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly createUseCase: CreateTodoUseCase,
    private readonly getAllByUserUseCase: GetAllTodosByUserUseCase,
    private readonly deleteUseCase: DeleteTodoUseCase,
    private readonly addTaskToUseCase: AddTaskToTodoUseCase,
    private readonly updateUseCase: UpdateTodoUseCase,
    private readonly setPictureUseCase: UploadPictureToTodoUseCase,
  ) {}

  @Post()
  async create(@Request() req, @Body() input: CreateOrUpdateTodoInput): Promise<TodoREST> {
    try {
      const userId: UserId = req.user.id;
      const todo = await this.createUseCase.run({
        userId,
        name: input.name,
        date: new Date(input.date),
      });
      return TodoRESTConverter.from(todo);
    } catch (e) {
      throw HttpErrorHandler.buildHttpExceptionFromDomainError(e);
    }
  }

  @Get()
  async getAllForUser(@Request() req): Promise<TodoREST[]> {
    try {
      const userId: UserId = req.user.id;
      const todos = await this.getAllByUserUseCase.run(userId);
      return TodoRESTConverter.fromMulti(todos);
    } catch (e) {
      throw HttpErrorHandler.buildHttpExceptionFromDomainError(e);
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req, @Param('id') id: number): Promise<void> {
    try {
      const todoId = new TodoId(id);
      const userId: UserId = req.user.id;
      await this.deleteUseCase.run({ todoId, userId });
    } catch (e) {
      throw HttpErrorHandler.buildHttpExceptionFromDomainError(e);
    }
  }

  @Patch('/:id')
  async update(@Request() req, @Param('id') id: number, @Body() input: CreateOrUpdateTodoInput): Promise<TodoREST> {
    try {
      const todoId = new TodoId(id);
      const userId = req.user.id;
      const newName = input.name;
      const newDate = new Date(input.date);
      const todo = await this.updateUseCase.run({ todoId, userId, newName, newDate });
      return TodoRESTConverter.from(todo);
    } catch (e) {
      throw HttpErrorHandler.buildHttpExceptionFromDomainError(e);
    }
  }

  @Post('/:id/tasks')
  async createTask(@Request() req, @Param('id') id: number, @Body() input: AddTaskTodoInput): Promise<TodoREST> {
    try {
      const todoId = new TodoId(id);
      const userId: UserId = req.user.id;
      const task = new Task(input.task);
      const todo = await this.addTaskToUseCase.run({ todoId, userId, task });
      return TodoRESTConverter.from(todo);
    } catch (e) {
      throw HttpErrorHandler.buildHttpExceptionFromDomainError(e);
    }
  }

  @Post('/:id/picture')
  @UseInterceptors(FileInterceptor('picture', { storage: PictureFileStore.buildDiskStorage() }))
  async setPicture(@Request() req, @Param('id') id, @UploadedFile() file): Promise<TodoREST> {
    try {
      const todoId = new TodoId(id);
      const userId: UserId = req.user.id;
      const picture = new Picture(file.filename);
      const todo = await this.setPictureUseCase.run({ todoId, userId, picture });
      return TodoRESTConverter.from(todo);
    } catch (e) {
      throw HttpErrorHandler.buildHttpExceptionFromDomainError(e);
    }
  }
}
