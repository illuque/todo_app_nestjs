import {
  AllowNull,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UserDB } from '../user/user.db';

@Table({ modelName: 'Todo' })
export class TodoDB extends Model<TodoDB> {
  // TODO:I todoRepository throws error if I add constructor to this class, investigate!

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  date: Date;

  @AllowNull(false)
  @Column
  picture: string;

  @AllowNull(false)
  @ForeignKey(() => UserDB)
  @Column
  createdBy: string;

  @Column(DataTypes.ARRAY(DataTypes.STRING))
  subTasks: string[];
}
