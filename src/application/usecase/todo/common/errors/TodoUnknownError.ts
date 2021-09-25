import { BaseGenericError } from '../../../common/errors/BaseGenericError';

export class TodoUnknownError extends BaseGenericError {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TodoUnknownError.prototype);
  }
}
