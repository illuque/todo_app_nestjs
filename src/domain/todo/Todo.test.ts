import { Todo } from './Todo';
import { UserId } from '../user/UserId';
import { InvalidTodoNameError } from '../../application/usecase/todo/common/errors/InvalidTodoNameError';
import { InvalidTodoDateError } from '../../application/usecase/todo/common/errors/InvalidTodoDateError';

const validDate = new Date('2021-09-24');
const userId = new UserId('userId');

describe('Todo', () => {
  describe('CreateNew', () => {
    it('should reject names with less than 8 digits', async () => {
      const invalidNameShort = 'short';
      expect(() => Todo.createNew(invalidNameShort, validDate, userId)).toThrow(InvalidTodoNameError);
    });
    it('should reject names with more than 16 digits', async () => {
      const invalidNameLong = 'too long name for this todo';
      expect(() => Todo.createNew(invalidNameLong, validDate, userId)).toThrow(InvalidTodoNameError);
    });
    it('should reject weekend date', async () => {
      const validName = 'aaabbbcccddd';
      const invalidDate = new Date('2021-09-25');
      expect(() => Todo.createNew(validName, invalidDate, userId)).toThrow(InvalidTodoDateError);
    });
    it('should accept when name is 8 digits long', async () => {
      const validName8 = 'val name';
      const todo = Todo.createNew(validName8, validDate, userId);
      validateOutput(todo, validName8);
    });
    it('should accept when name is 16 digits long', async () => {
      const validName16 = 'aaaabbbbccccdddd';
      const todo = Todo.createNew(validName16, validDate, userId);
      validateOutput(todo, validName16);
    });
    it('should accept when name between the limits', async () => {
      const validName = 'aaabbbcccddd';
      const todo = Todo.createNew(validName, validDate, userId);
      validateOutput(todo, validName);
    });
  });
});

function validateOutput(todo: Todo, expectedName: string) {
  expect(todo.name).toEqual(expectedName);
  expect(todo.date).toEqual(validDate);
  expect(todo.createdBy).toEqual(userId);
  expect(todo.subTasks).toEqual([]);
  expect(todo.picture).toEqual(null);
}
