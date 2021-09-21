import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { TodoUseCase } from '../../application/usecase/todo.usecase';
import { Todo } from '../../domain/todo';
import { TodoDeleteResult } from '../../application/dto/todo.delete-result';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoUseCase: TodoUseCase) {}

  @Post()
  async create(@Request() req, @Body() todo: Todo) {
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
  @HttpCode(202)
  async delete(@Request() req, @Param('id') todoId: number) {
    const deleteResult = await this.todoUseCase.deleteById(todoId, req.user.id);
    switch (deleteResult) {
      case TodoDeleteResult.Ok:
        return;
      case TodoDeleteResult.NokForbidden:
        throw new ForbiddenException('User cannot delete this Todo');
      case TodoDeleteResult.NokNotFound:
        throw new NotFoundException('Todo not found');
      case TodoDeleteResult.UnknownError:
        throw new InternalServerErrorException('Unknown error deleteing Todo');
    }
  }
}
