import { Module } from '@nestjs/common';
import { DatabaseModule } from '../repositories/database.module';
import { RepositoryDB } from '../../application/ports/repository.service';
import { UserRepositoryDB } from '../repositories/user/user.db.repository';
import { userDatabaseProviders } from '../repositories/user/user.db.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    { provide: RepositoryDB, useClass: UserRepositoryDB },
    ...userDatabaseProviders,
  ],
  exports: [{ provide: RepositoryDB, useClass: UserRepositoryDB }],
})
export class UserModule {}
