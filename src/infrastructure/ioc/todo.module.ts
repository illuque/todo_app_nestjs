import { Module } from '@nestjs/common';
import { todoDatabaseProviders } from '../repositories/todo/todo.db.provider';
import { DatabaseModule } from '../repositories/database.module';
import { TodoRepositoryPostgres } from '../repositories/todo/todo.db.repository';
import { TodoController } from '../../interfaces/controllers/todo.controller';
import { TodoUseCase } from '../../application/usecase/todo.usecase';
import { TodoRepository } from '../../application/ports/todo.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [TodoController],
  providers: [
    TodoUseCase,
    { provide: TodoRepository, useClass: TodoRepositoryPostgres },
    ...todoDatabaseProviders,
  ],
})
export class TodoModule {}
