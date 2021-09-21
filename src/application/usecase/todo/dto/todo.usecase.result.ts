import { Todo } from '../../../../domain/todo';
import { UseCaseError } from '../../common/dto/usecase.errors';

export class TodoUseCaseResult {
  private readonly object: Todo;
  private readonly errorCode: UseCaseError;

  protected constructor(object: Todo, errorCodes: UseCaseError) {
    this.errorCode = errorCodes;
    this.object = object;
  }

  isOk(): boolean {
    return this.errorCode === null;
  }

  getError(): UseCaseError {
    return this.errorCode;
  }

  getObject(): Todo {
    return this.object;
  }

  static CreateOk(todoWritten: Todo) {
    return new this(todoWritten, null);
  }

  static CreateErrorForbidden() {
    return new this(null, UseCaseError.Forbidden);
  }

  static CreateErrorNotFound() {
    return new this(null, UseCaseError.NotFound);
  }

  static CreateErrorUnknown() {
    return new this(null, UseCaseError.Unknown);
  }
}
