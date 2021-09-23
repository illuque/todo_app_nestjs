import { UseCaseError } from '../../common/dto/usecase.errors';

export class TodoUseCaseDeleteResultDto {
  private readonly errorCode: UseCaseError;
  private readonly message: string;

  protected constructor(error: UseCaseError, message: string) {
    this.errorCode = error;
    this.message = message;
  }

  isOk(): boolean {
    return this.errorCode === null;
  }

  getError(): UseCaseError {
    return this.errorCode;
  }

  getMessage(): string {
    return this.message;
  }

  static CreateOk() {
    return new this(null, null);
  }

  static CreateErrorForbidden(message = '') {
    return new this(UseCaseError.Forbidden, message);
  }

  static CreateErrorNotFound(message = '') {
    return new this(UseCaseError.NotFound, message);
  }

  static CreateErrorUnknown(message = '') {
    return new this(UseCaseError.Unknown, message);
  }
}
