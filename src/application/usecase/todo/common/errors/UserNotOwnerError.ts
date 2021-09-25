import { BaseForbiddenError } from '../../../common/errors/BaseForbiddenError';

export class UserNotOwnerError extends BaseForbiddenError {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UserNotOwnerError.prototype);
  }
}
