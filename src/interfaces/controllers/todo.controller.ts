import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoUseCase } from '../../application/usecase/todo.usecase';
import { Todo } from '../../domain/todo';
import { AuthGuard } from '@nestjs/passport';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoUseCase: TodoUseCase) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createTodo(@Body() todo: Todo) {
    return this.todoUseCase.create(todo);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getTodo(@Param('id') id: number): Promise<Todo> {
    const todo = await this.todoUseCase.findOneById(id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }
}
