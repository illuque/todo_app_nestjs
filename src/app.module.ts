import { Module } from '@nestjs/common';
import { TodoModule } from './infrastructure/ioc/todo.module';
import { AuthModule } from './infrastructure/ioc/auth.module';

@Module({
  imports: [TodoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
