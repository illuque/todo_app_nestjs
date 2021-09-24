export class Todo {
  readonly id: number; // TODO:I eliminar del payload de create o update
  readonly name: string;
  readonly date: Date;
  readonly picture: string; // TODO:I eliminar del payload de create o update
  readonly createdBy: string; // TODO:I eliminar del payload de create o update
  readonly subTasks: string[]; // TODO:I eliminar del payload de create o update

  static Create(id: number, name: string, date: Date, picture: string, createdBy: string, subTasks: string[]): Todo {
    return new Todo(id, name, date, picture, createdBy, subTasks);
  }

  private constructor(id: number, name: string, date: Date, picture: string, createdBy: string, subtasks: string[]) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.picture = picture;
    this.createdBy = createdBy;
    this.subTasks = subtasks;
  }
}
