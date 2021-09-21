import { Module } from '@nestjs/common';
import { todoDatabaseProviders } from '../repositories/todo/todo.db.provider';
import { DatabaseModule } from '../repositories/database.module';
import { TodoRepositoryDB } from '../repositories/todo/todo.db.repository';
import { TodoController } from '../../interfaces/controllers/todo.controller';
import { TodoUseCase } from '../../application/usecase/todo.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [TodoController],
  providers: [TodoUseCase, TodoRepositoryDB, ...todoDatabaseProviders],
})
export class TodoModule {}
