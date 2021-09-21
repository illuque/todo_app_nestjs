export class Todo {
  readonly name: string;
  readonly date: Date;
  readonly picture: string;
  readonly createdBy: string;
  readonly subTasks: string[];

  constructor(
    name: string,
    date: Date,
    picture: string,
    createdBy: string,
    subtasks: string[],
  ) {
    this.name = name;
    this.date = date;
    this.picture = picture;
    this.createdBy = createdBy;
    this.subTasks = subtasks;
  }
}
