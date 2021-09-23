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
import { UseCaseError } from '../../application/usecase/common/dto/usecase.errors';
import { TodoAddTaskDto } from './dto/todo.add-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PICTURES_PATH } from '../../infrastructure/constants';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoUseCase: TodoUseCase) {}

  @Post()
  async create(
    @Request() req,
    @Body() todo: Todo, // TODO:I create DTO
  ) {
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
    const deleteResult = await this.todoUseCase.deleteById(todoId, req.user.id);
    if (deleteResult.isOk()) {
      return;
    }

    TodoController.throwHttpException(
      deleteResult.getError(),
      deleteResult.getMessage(),
    );
  }

  @Patch('/:id')
  async patch(
    @Request() req,
    @Param('id') todoId: number,
    @Body() todo: Todo, // TODO:I create DTO
  ): Promise<Todo> {
    const updateResult = await this.todoUseCase.update(
      // TODO:I crear ValueObjects para los input del DTO?
      todoId,
      req.user.id,
      todo,
    );
    if (updateResult.isOk()) {
      return updateResult.getObject();
    }

    TodoController.throwHttpException(
      updateResult.getError(),
      updateResult.getMessage(),
    );
  }

  @Post('/:id/task')
  async createTask(
    @Request() req,
    @Param('id') todoId: number,
    @Body() taskDto: TodoAddTaskDto, // TODO:I create DTO
  ): Promise<Todo> {
    const createTaskResult = await this.todoUseCase.addTask(
      todoId,
      req.user.id,
      taskDto.task,
    );

    if (createTaskResult.isOk()) {
      return createTaskResult.getObject();
    }

    TodoController.throwHttpException(
      createTaskResult.getError(),
      createTaskResult.getMessage(),
    );
  }

  @Post('/:id/picture')
  @UseInterceptors(FileInterceptor('file', { storage: buildDiskStorage() }))
  async setPicture(
    @Request() req,
    @Param('id') todoId,
    @UploadedFile() file,
  ): Promise<Todo> {
    const setPictureResult = await this.todoUseCase.setPicture(
      todoId,
      req.user.id,
      file.filename,
    );

    if (setPictureResult.isOk()) {
      return setPictureResult.getObject();
    }

    TodoController.throwHttpException(
      setPictureResult.getError(),
      setPictureResult.getMessage(),
    );
  }

  private static throwHttpException(error: UseCaseError, message: string) {
    switch (error) {
      case UseCaseError.Forbidden:
        throw new ForbiddenException(message || 'User not allowed');
      case UseCaseError.BadRequest:
        throw new BadRequestException(message || 'Invalid request');
      case UseCaseError.NotFound:
        throw new NotFoundException(message || 'Todo not found');
      case UseCaseError.Unknown:
        throw new InternalServerErrorException(message || 'Unknown error');
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
