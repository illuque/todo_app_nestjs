import { Module } from '@nestjs/common';
import { TodoModule } from './infrastructure/ioc/todo.module';

@Module({
  imports: [TodoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
