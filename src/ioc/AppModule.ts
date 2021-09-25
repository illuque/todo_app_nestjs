import { Module } from '@nestjs/common';
import { TodoModule } from './TodoModule';
import { AuthModule } from './AuthModule';
import { PictureController } from '../interfaces/controllers/PictureController';

@Module({
  imports: [TodoModule, AuthModule],
  controllers: [PictureController],
  providers: [],
})
export class AppModule {}
