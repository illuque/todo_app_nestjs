import { AllowNull, Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ modelName: 'Todo' })
export class TodoDB extends Model<TodoDB> {
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
  @Column
  createdBy: number;

  @Column(DataTypes.ARRAY(DataTypes.STRING))
  subTasks: string[];
}
