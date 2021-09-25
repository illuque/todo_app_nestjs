import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/repositories/common/DatabaseModule';
import { UserRepositoryDB } from '../infrastructure/repositories/user/UserDBRepository';
import { userDatabaseProviders } from '../infrastructure/repositories/user/UserDBProvider';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [UserRepositoryDB, ...userDatabaseProviders],
  exports: [UserRepositoryDB],
})
export class UserModule {}
