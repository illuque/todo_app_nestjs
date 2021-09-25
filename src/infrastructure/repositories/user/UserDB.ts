import { AllowNull, BeforeCreate, BeforeUpdate, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

import * as bcrypt from 'bcrypt';

@Table({ modelName: 'User' })
export class UserDB extends Model<UserDB> {
  // TODO:I create domain class for this one!

  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  password: string;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: UserDB) {
    if (user.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.password);
  }
}
