import { Module } from '@nestjs/common';
import { todoDatabaseProviders } from '../repositories/todo/todo.db.provider';
import { DatabaseModule } from '../repositories/database.module';
import { TodoRepositoryDB } from '../repositories/todo/todo.db.repository';
import { TodoController } from '../../interfaces/controllers/todo.controller';
import { TodoUseCase } from '../../application/usecase/todo.usecase';
import { RepositoryDB } from '../../application/ports/repository.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TodoController],
  providers: [
    TodoUseCase,
    { provide: RepositoryDB, useClass: TodoRepositoryDB },
    ...todoDatabaseProviders,
  ],
})
export class TodoModule {}
