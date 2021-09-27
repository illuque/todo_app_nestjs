import { User } from '../../domain/user/User';
import { UserId } from '../../domain/user/UserId';

export interface UserRepository {
  create(user: User): Promise<User>;

  findOne(userId: UserId): Promise<User>;
}
