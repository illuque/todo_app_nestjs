import { BaseNotFoundError } from '../../../common/errors/BaseNotFoundError';

export class TodoNotFoundError extends BaseNotFoundError {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TodoNotFoundError.prototype);
  }
}
