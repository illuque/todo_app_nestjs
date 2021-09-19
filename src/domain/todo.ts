export class Todo {
  readonly name: string;
  readonly date: Date;
  readonly picture: string;
  readonly createdBy: number;
  readonly subTasks: string[];

  constructor(
    name: string,
    date: Date,
    picture: string,
    createdBy: number,
    subtasks: string[],
  ) {
    this.name = name;
    this.date = date;
    this.picture = picture;
    this.createdBy = createdBy;
    this.subTasks = subtasks;
  }
}
