import { UserId } from '../../../domain/user/UserId';
import { UserDB } from './UserDB';
import { User } from '../../../domain/user/User';

export class UserDBConverter {
  static fromDB(userDB: UserDB): User {
    return User.createExisting(new UserId(userDB.id), userDB.name, userDB.password);
  }
}
