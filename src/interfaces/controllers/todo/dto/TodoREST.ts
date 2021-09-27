export class TodoREST {
  readonly id: number;
  readonly name: string;
  readonly date: Date;
  readonly picture: string;
  readonly subTasks: string[];

  constructor(id: number, name: string, date: Date, picture: string, subTasks: string[]) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.picture = picture;
    this.subTasks = subTasks;
  }
}
