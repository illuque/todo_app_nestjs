import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ modelName: 'Todo' })
export class TodoDB extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  name: string;

  @Column
  date: Date;

  @Column
  picture: string;

  @Column
  createdBy: string;

  @HasMany(() => TodoDB, 'id')
  subTasks: TodoDB[];
}
