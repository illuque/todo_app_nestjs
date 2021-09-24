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
import { TodoUseCase } from '../../application/usecase/todo/todo.usecase';
import { Todo } from '../../domain/todo';
import { TodoAddTaskDto } from './dto/todo.add-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PICTURES_PATH } from '../../infrastructure/constants';
import {
  TodoNotFoundError,
  TodoNotOwnedByUserError,
  TodoNotUpdatableError,
  TodoUnknownError,
} from '../../application/usecase/todo/todo.usecase.errors';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoUseCase: TodoUseCase) {}

  @Post()
  async create(@Request() req, @Body() todo: Todo) {
    // TODO:I create DTO
    return this.todoUseCase.create(req.user.id, todo);
  }

  @Get()
  async getAllForUser(@Request() req): Promise<Todo[]> {
    const todos = await this.todoUseCase.findAllByCreator(req.user.id);
    if (!todos) {
      throw new NotFoundException('Todo not found');
    }
    return todos;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req, @Param('id') todoId: number) {
    try {
      await this.todoUseCase.deleteById(todoId, req.user.id);
    } catch (e) {
      throw TodoController.throwHttpException(e);
    }
  }

  @Patch('/:id')
  async patch(@Request() req, @Param('id') todoId: number, @Body() todo: Todo): Promise<Todo> {
    // TODO:I create DTO
    // TODO:I crear ValueObjects para los input del DTO?
    try {
      return await this.todoUseCase.update(todoId, req.user.id, todo);
    } catch (e) {
      throw TodoController.throwHttpException(e);
    }
  }

  @Post('/:id/task')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createTask(@Request() req, @Param('id') todoId: number, @Body() taskDto: TodoAddTaskDto) {
    // TODO:I create DTO
    try {
      await this.todoUseCase.addTask(todoId, req.user.id, taskDto.task);
    } catch (e) {
      throw TodoController.throwHttpException(e);
    }
  }

  @Post('/:id/picture')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('file', { storage: buildDiskStorage() }))
  async setPicture(@Request() req, @Param('id') todoId, @UploadedFile() file) {
    try {
      await this.todoUseCase.setPicture(todoId, req.user.id, file.filename);
    } catch (e) {
      throw TodoController.throwHttpException(e);
    }
  }

  private static throwHttpException(error: Error): Error {
    switch (error.constructor) {
      case TodoNotFoundError:
        return new NotFoundException(error.message);
      case TodoNotOwnedByUserError:
        return new ForbiddenException(error.message);
      case TodoNotUpdatableError:
        return new BadRequestException(error.message);
      case TodoUnknownError:
        return new InternalServerErrorException(error.message);
      default:
        return new InternalServerErrorException('Unknown error happened');
    }
  }
}

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
