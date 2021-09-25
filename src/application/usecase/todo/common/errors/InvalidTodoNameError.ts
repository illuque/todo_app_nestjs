import { BaseBadRequestError } from '../../../common/errors/BaseBadRequestError';

export class InvalidTodoNameError extends BaseBadRequestError {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidTodoNameError.prototype);
  }
}
