import { UserId } from '../vo/UserId';
import { TodoId } from '../vo/TodoId';
import { Picture } from '../Picture';
import { Task } from '../Task';
import { InvalidTodoNameError } from '../../application/usecase/todo/common/errors/InvalidTodoNameError';
import { InvalidTodoDateError } from '../../application/usecase/todo/common/errors/InvalidTodoDateError';
import { DuplicatedTaskError } from '../../application/usecase/todo/common/errors/DuplicatedTaskError';

export class Todo {
  private static readonly SATURDAY_DAY_OF_WEEK = 6;
  private static readonly SUNDAY_DAY_OF_WEEK = 0;

  private static readonly NAME_MIN_CHARS = 8;
  private static readonly NAME_MAX_CHARS = 16;

  readonly id: TodoId;
  private _name: string;
  private _date: Date;
  private _picture: Picture;
  readonly createdBy: UserId;
  // being an array it will be modifiable any way, but at least this is a hint on using the addTask method
  private _subTasks: Task[];

  static CreateNew(name: string, date: Date, createdBy: UserId): Todo {
    return new Todo(null, name, date, null, createdBy, []);
  }

  static CreateExisting(
    id: TodoId,
    name: string,
    date: Date,
    picture: Picture,
    createdBy: UserId,
    subTasks: Task[],
  ): Todo {
    return new Todo(id, name, date, picture, createdBy, subTasks);
  }

  private constructor(id: TodoId, name: string, date: Date, picture: Picture, createdBy: UserId, subtasks: Task[]) {
    this.id = id;
    this.changeName(name);
    this.changeDate(date);
    this._picture = picture;
    this.createdBy = createdBy;
    this._subTasks = subtasks;
  }

  get name() {
    return this._name;
  }

  get date() {
    return this._date;
  }

  get picture() {
    return this._picture;
  }

  get subTasks() {
    return this._subTasks;
  }

  changeName(name: string) {
    this.validateName(name);

    this._name = name;
  }

  changeDate(date: Date) {
    this.validateDate(date);

    this._date = date;
  }

  setPicture(picture: Picture) {
    this._picture = picture;
  }

  addTask(task: Task) {
    const alreadyExistingTask = this._subTasks.find((t) => t.equals(task));
    if (alreadyExistingTask) {
      throw new DuplicatedTaskError('Duplicated task');
    }

    this._subTasks.push(task);
  }

  private validateName(name: string) {
    const validName = name.length >= Todo.NAME_MIN_CHARS && name.length <= Todo.NAME_MAX_CHARS;
    if (!validName) {
      throw new InvalidTodoNameError('Invalid Todo name: must have between 8 and 16 characters');
    }
  }

  private validateDate(date: Date) {
    const dayOfWeek = date.getDay();
    const weekDay = dayOfWeek !== Todo.SATURDAY_DAY_OF_WEEK && dayOfWeek !== Todo.SUNDAY_DAY_OF_WEEK;
    if (!weekDay) {
      throw new InvalidTodoDateError("Invalid Todo date: date of the TODO can't be Saturday or Sunday");
    }
  }
}
