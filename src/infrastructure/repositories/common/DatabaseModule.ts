import { Module } from '@nestjs/common';
import { databaseProvider } from './DatabaseProvider';

@Module({
  providers: [...databaseProvider],
  exports: [...databaseProvider],
})
export class DatabaseModule {}
