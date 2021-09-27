import { IsNotEmpty } from 'class-validator';
import { IsCorrectLength } from '../TodoNameValidator';
import { Todo } from '../../../../domain/todo/Todo';

const message = `Invalid Todo name: must have between ${Todo.NAME_MIN_CHARS} and ${Todo.NAME_MAX_CHARS} characters`;

export class CreateOrUpdateTodoInput {
  @IsCorrectLength(Todo.NAME_MIN_CHARS, Todo.NAME_MAX_CHARS, { message })
  name: string;

  @IsNotEmpty()
  date: string;
}
