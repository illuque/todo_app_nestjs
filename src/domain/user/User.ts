import { UserId } from './UserId';
import * as bcrypt from 'bcrypt';

export class User {
  readonly id: UserId;

  readonly name: string;

  readonly password: string;

  private constructor(id: UserId, name: string, password: string) {
    this.id = id;
    this.name = name;
    this.password = password;
  }

  static createExisting(id: UserId, name: string, password: string) {
    return new User(id, name, password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.password);
  }
}
