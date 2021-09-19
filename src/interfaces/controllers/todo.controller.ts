import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TodoUseCase } from '../../application/usecase/todo.usecase';
import { Todo } from '../../domain/todo';

@Controller()
export class TodoController {
  constructor(private readonly todoUseCase: TodoUseCase) {}

  @Post('todo')
  async createTodo(@Body() todo: Todo) {
    return this.todoUseCase.create(todo);
  }

  @Get('todo/:id')
  async getTodo(@Param('id') id: number): Promise<Todo> {
    return this.todoUseCase.findOneById(id);
  }
}
