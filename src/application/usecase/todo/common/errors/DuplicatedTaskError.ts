import { BaseBadRequestError } from '../../../common/errors/BaseBadRequestError';

export class DuplicatedTaskError extends BaseBadRequestError {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DuplicatedTaskError.prototype);
  }
}
