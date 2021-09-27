import { IsNotEmpty } from 'class-validator';

export class AddTaskTodoInput {
  @IsNotEmpty()
  task: string;
}
