import { Todo } from '../../../../domain/todo';
import { UseCaseError } from '../../common/dto/usecase.errors';

export class TodoUseCaseResult {
  private readonly object: Todo;
  private readonly errorCode: UseCaseError;
  private readonly message: string;

  protected constructor(todo: Todo, errorCodes: UseCaseError, message: string) {
    this.errorCode = errorCodes;
    this.object = todo;
    this.message = message;
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

  getMessage(): string {
    return this.message;
  }

  static CreateOk(todoWritten: Todo) {
    return new this(todoWritten, null, null);
  }

  static CreateErrorForbidden(message = '') {
    return new this(null, UseCaseError.Forbidden, message);
  }

  static CreateErrorNotFound(message = '') {
    return new this(null, UseCaseError.NotFound, message);
  }

  static CreateBadRequest(message = '') {
    return new this(null, UseCaseError.BadRequest, message);
  }

  static CreateErrorUnknown(message = '') {
    return new this(null, UseCaseError.Unknown, message);
  }
}
