import {
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
} from '@nestjs/common';
import { TodoUseCase } from '../../application/usecase/todo/todo.usecase';
import { Todo } from '../../domain/todo';
import { UseCaseError } from '../../application/usecase/common/dto/usecase.errors';

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

    TodoController.throwHttpException(deleteResult.getError());
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

    TodoController.throwHttpException(updateResult.getError());
  }

  private static throwHttpException(error: UseCaseError) {
    switch (error) {
      case UseCaseError.Forbidden:
        throw new ForbiddenException('User not allowed');
      case UseCaseError.NotFound:
        throw new NotFoundException('Todo not found');
      case UseCaseError.Unknown:
        throw new InternalServerErrorException('Unknown error');
    }
  }
}
