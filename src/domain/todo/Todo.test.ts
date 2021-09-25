import { Todo } from './Todo';
import { UserId } from '../vo/UserId';
import { InvalidTodoNameError } from '../../application/usecase/todo/common/errors/InvalidTodoNameError';
import { InvalidTodoDateError } from '../../application/usecase/todo/common/errors/InvalidTodoDateError';
import { Picture } from '../Picture';

const validName = 'valid name';
const invalidNameShort = 'short';
const invalidNameLong = 'too long name for this todo';

const validDate = new Date('2021-09-24');
const invalidDate = new Date('2021-09-25');

const userId = new UserId('userId');

// TODO:I Ensure integration tests that ensure that you can only get TO-DOs that are yours.

describe('Todo', () => {
  describe('CreateNew', () => {
    it('should reject names with less than 8 digits', async () => {
      expect(() => Todo.CreateNew(invalidNameShort, validDate, userId)).toThrow(InvalidTodoNameError);
    });
    it('should reject names with more than 16 digits', async () => {
      expect(() => Todo.CreateNew(invalidNameLong, validDate, userId)).toThrow(InvalidTodoNameError);
    });
    it('should reject weekend date', async () => {
      expect(() => Todo.CreateNew(validName, invalidDate, userId)).toThrow(InvalidTodoDateError);
    });
    it('should create when valid input', async () => {
      const name = 'valid name';
      const todo = Todo.CreateNew(name, validDate, userId);

      expect(todo.name).toEqual(name);
      expect(todo.date).toEqual(validDate);
      expect(todo.createdBy).toEqual(userId);
      expect(todo.subTasks).toEqual([]);
      expect(todo.picture).toEqual(null);
    });
  });
});
