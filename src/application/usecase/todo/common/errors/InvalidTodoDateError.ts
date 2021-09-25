import { BaseBadRequestError } from '../../../common/errors/BaseBadRequestError';

export class InvalidTodoDateError extends BaseBadRequestError {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidTodoDateError.prototype);
  }
}
