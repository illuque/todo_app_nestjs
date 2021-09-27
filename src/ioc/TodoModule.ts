import { Module } from '@nestjs/common';
import { todoDatabaseProviders } from '../infrastructure/repositories/todo/TodoDBProvider';
import { DatabaseModule } from '../infrastructure/repositories/common/DatabaseModule';
import { TodoRepositoryDB } from '../infrastructure/repositories/todo/TodoDBRepository';
import { TodoController } from '../interfaces/controllers/todo/TodoController';
import { CreateTodoUseCase } from '../application/usecase/todo/CreateTodoUseCase';
import { GetAllTodosByUserUseCase } from '../application/usecase/todo/GetAllTodosByUserUseCase';
import { DeleteTodoUseCase } from '../application/usecase/todo/DeleteTodoUseCase';
import { AddTaskToTodoUseCase } from '../application/usecase/todo/AddTaskToTodoUseCase';
import { UpdateTodoUseCase } from '../application/usecase/todo/UpdateTodoUseCase';
import { UploadPictureToTodoUseCase } from '../application/usecase/todo/UploadPictureToTodoUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [TodoController],
  providers: [
    CreateTodoUseCase,
    GetAllTodosByUserUseCase,
    DeleteTodoUseCase,
    UploadPictureToTodoUseCase,
    AddTaskToTodoUseCase,
    UpdateTodoUseCase,
    TodoRepositoryDB,
    ...todoDatabaseProviders,
  ],
})
export class TodoModule {}
