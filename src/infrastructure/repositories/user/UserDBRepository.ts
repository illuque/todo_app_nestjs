import { Inject, Injectable, NotImplementedException } from '@nestjs/common';

import { UserDB } from './UserDB';
import { USER_REPOSITORY } from '../common/DBConstants';
import { User } from '../../../domain/user/User';
import { UserDBConverter } from './UserDBConverter';
import { UserId } from '../../../domain/user/UserId';
import { UserRepository } from '../../../application/ports/UserRepository';

@Injectable()
export class UserRepositoryDB implements UserRepository {
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
