import { Inject, Injectable } from '@nestjs/common';

import { UserDB } from './UserDB';
import { USER_REPOSITORY } from '../common/DBConstants';
import { RepositoryDB } from '../../../application/ports/RepositoryService';

@Injectable()
export class UserRepositoryDB implements RepositoryDB<string, UserDB> {
  // TODO:I extract interface
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: typeof UserDB,
  ) {}

  async create(user: UserDB): Promise<UserDB> {
    return await user.save();
  }

  async findOne(id: string): Promise<UserDB> {
    return await this.userRepository.findOne<UserDB>({ where: { id } });
  }
}
