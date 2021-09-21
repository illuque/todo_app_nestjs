import { Inject, Injectable } from '@nestjs/common';

import { UserDB } from './user.db';
import { USER_REPOSITORY } from '../constants';
import { RepositoryDB } from '../../../application/ports/repository.service';

@Injectable()
export class UserRepositoryDB implements RepositoryDB<string, UserDB> {
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
