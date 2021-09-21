import { Module } from '@nestjs/common';
import { DatabaseModule } from '../repositories/database.module';
import { UserRepositoryDB } from '../repositories/user/user.db.repository';
import { userDatabaseProviders } from '../repositories/user/user.db.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [UserRepositoryDB, ...userDatabaseProviders],
  exports: [UserRepositoryDB],
})
export class UserModule {}
