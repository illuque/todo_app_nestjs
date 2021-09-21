import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodoUseCase } from '../../application/usecase/todo.usecase';
import { Todo } from '../../domain/todo';
import { AuthGuard } from '@nestjs/passport';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoUseCase: TodoUseCase) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createTodo(@Request() req, @Body() todo: Todo) {
    return this.todoUseCase.create(req.user.id, todo);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getTodos(@Request() req): Promise<Todo[]> {
    const todos = await this.todoUseCase.findAllByCreator(req.user.id);
    if (!todos) {
      throw new NotFoundException('Todo not found');
    }
    return todos;
  }
}
