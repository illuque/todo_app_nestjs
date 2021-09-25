import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { AddTaskTodoInput } from './dto/todo/AddTaskTodoInput';
import { FileInterceptor } from '@nestjs/platform-express';
import { PICTURES_PATH } from '../../infrastructure/file/FileConstants';
import { CreateTodoUseCase } from '../../application/usecase/todo/CreateTodoUseCase';
import { GetAllTodosByUserUseCase } from '../../application/usecase/todo/GetAllTodosByUserUseCase';
import { DeleteTodoUseCase } from '../../application/usecase/todo/DeleteTodoUseCase';
import { AddTaskToTodoUseCase } from '../../application/usecase/todo/AddTaskToTodoUseCase';
import { UpdateTodoUseCase } from '../../application/usecase/todo/UpdateTodoUseCase';
import { UploadPictureToTodoUseCase } from '../../application/usecase/todo/UploadPictureToTodoUseCase';
import { UserId } from '../../domain/vo/UserId';
import { TodoId } from '../../domain/vo/TodoId';
import { Task } from '../../domain/Task';
import { Picture } from '../../domain/Picture';
import { BaseNotFoundError } from '../../application/usecase/common/errors/BaseNotFoundError';
import { BaseForbiddenError } from '../../application/usecase/common/errors/BaseForbiddenError';
import { BaseBadRequestError } from '../../application/usecase/common/errors/BaseBadRequestError';
import { BaseGenericError } from '../../application/usecase/common/errors/BaseGenericError';
import { CreateOrUpdateTodoInput } from './dto/todo/CreateOrUpdateTodoInput';
import { TodoREST } from './dto/todo/TodoREST';
import { TodoRESTConverter } from './converters/TodoConverter';

@Controller('todos')
export class TodoController {
  private static readonly logger = new Logger(TodoController.name);

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
      const userId = new UserId(req.user.id);
      const todo = await this.createUseCase.run({
        userId,
        name: input.name,
        date: new Date(input.date),
      });
      return TodoRESTConverter.from(todo);
    } catch (e) {
      throw TodoController.buildHttpException(e);
    }
  }

  @Get()
  async getAllForUser(@Request() req): Promise<TodoREST[]> {
    try {
      const userId = new UserId(req.user.id);
      const todos = await this.getAllByUserUseCase.run(userId);
      return TodoRESTConverter.fromMulti(todos);
    } catch (e) {
      throw TodoController.buildHttpException(e);
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req, @Param('id') id: number): Promise<void> {
    try {
      const todoId = new TodoId(id);
      const userId = new UserId(req.user.id);
      await this.deleteUseCase.run({ todoId, userId });
    } catch (e) {
      throw TodoController.buildHttpException(e);
    }
  }

  @Patch('/:id')
  async update(@Request() req, @Param('id') id: number, @Body() input: CreateOrUpdateTodoInput): Promise<TodoREST> {
    try {
      const todo = await this.updateUseCase.run({
        todoId: new TodoId(id),
        userId: new UserId(req.user.id),
        newName: input.name,
        newDate: new Date(input.date),
      });
      return TodoRESTConverter.from(todo);
    } catch (e) {
      throw TodoController.buildHttpException(e);
    }
  }

  @Post('/:id/tasks')
  async createTask(@Request() req, @Param('id') id: number, @Body() input: AddTaskTodoInput): Promise<TodoREST> {
    try {
      const todoId = new TodoId(id);
      const userId = new UserId(req.user.id);
      const task = new Task(input.task);
      const todo = await this.addTaskToUseCase.run({ todoId, userId, task });
      return TodoRESTConverter.from(todo);
    } catch (e) {
      throw TodoController.buildHttpException(e);
    }
  }

  @Post('/:id/picture')
  @UseInterceptors(FileInterceptor('picture', { storage: buildDiskStorage() }))
  async setPicture(@Request() req, @Param('id') id, @UploadedFile() file): Promise<TodoREST> {
    try {
      const todoId = new TodoId(id);
      const userId = new UserId(req.user.id);
      const picture = new Picture(file.filename);
      const todo = await this.setPictureUseCase.run({ todoId, userId, picture });
      return TodoRESTConverter.from(todo);
    } catch (e) {
      throw TodoController.buildHttpException(e);
    }
  }

  private static buildHttpException(e: Error): Error {
    if (e instanceof BaseNotFoundError) {
      return new NotFoundException(e.message);
    }
    if (e instanceof BaseForbiddenError) {
      return new ForbiddenException(e.message);
    }
    if (e instanceof BaseBadRequestError) {
      return new BadRequestException(e.message);
    }
    if (e instanceof BaseGenericError) {
      return new InternalServerErrorException(e.message);
    }

    this.logger.error('Unexpected e on controller', e.stack);
    return new InternalServerErrorException('Unknown error happened');
  }
}

// TODO:I mover a otra clase
function getFilename() {
  return (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    return cb(null, `${randomName}${extname(file.originalname)}`);
  };
}

function buildDiskStorage() {
  return diskStorage({
    destination: `./${PICTURES_PATH}`,
    filename: getFilename(),
  });
}
