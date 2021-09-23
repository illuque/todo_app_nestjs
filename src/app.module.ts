import { Module } from '@nestjs/common';
import { TodoModule } from './infrastructure/ioc/todo.module';
import { AuthModule } from './infrastructure/ioc/auth.module';
import { PictureController } from './interfaces/controllers/picture.controller';

@Module({
  imports: [TodoModule, AuthModule],
  controllers: [PictureController],
  providers: [],
})
export class AppModule {}
