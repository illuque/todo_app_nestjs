import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { TodoDatabaseService } from './todo.db.service';
import { todoDatabaseProviders } from './todo.db.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [TodoDatabaseService, ...todoDatabaseProviders],
  exports: [TodoDatabaseService, ...todoDatabaseProviders],
})
export class TodoDatabaseModule {}
