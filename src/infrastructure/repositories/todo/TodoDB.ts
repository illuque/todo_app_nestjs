import { AllowNull, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UserDB } from '../user/UserDB';

@Table({ modelName: 'Todo' })
export class TodoDB extends Model<TodoDB> {
  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  date: Date;

  @AllowNull(true)
  @Column
  picture: string;

  @AllowNull(false)
  @ForeignKey(() => UserDB)
  @Column
  createdBy: string;

  @Column(DataTypes.ARRAY(DataTypes.STRING))
  subTasks: string[];
}
