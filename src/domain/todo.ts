export class Todo {
  readonly id: number;
  readonly name: string;
  readonly date: Date;
  readonly picture: string;
  readonly createdBy: string;
  readonly subTasks: string[];

  constructor(
    id: number,
    name: string,
    date: Date,
    picture: string,
    createdBy: string,
    subtasks: string[],
  ) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.picture = picture;
    this.createdBy = createdBy;
    this.subTasks = subtasks;
  }
}
