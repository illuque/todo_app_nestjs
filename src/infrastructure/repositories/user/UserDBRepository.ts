import { Inject, Injectable, NotImplementedException } from '@nestjs/common';

import { UserDB } from './UserDB';
import { USER_REPOSITORY } from '../common/DBConstants';
import { RepositoryDB } from '../../../application/ports/RepositoryService';
import { User } from '../../../domain/user/User';
import { UserDBConverter } from './UserDBConverter';
import { UserId } from '../../../domain/user/UserId';

@Injectable()
export class UserRepositoryDB implements RepositoryDB<UserId, User> {
  // TODO:I extract interface
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: typeof UserDB,
  ) {}

  async create(user: User): Promise<User> {
    // TODO: Future
    throw new NotImplementedException('Method not yet implemented');
  }

  async findOne(userId: UserId): Promise<User> {
    const userDB = await this.userRepository.findOne<UserDB>({ where: { id: userId.value } });
    return UserDBConverter.fromDB(userDB);
  }
}
