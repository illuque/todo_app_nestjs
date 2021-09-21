import { UseCaseError } from '../../common/dto/usecase.errors';

export class TodoUseCaseDeleteResultDto {
  private readonly errorCode: UseCaseError;

  protected constructor(error: UseCaseError) {
    this.errorCode = error;
  }

  isOk(): boolean {
    return this.errorCode === null;
  }

  getError(): UseCaseError {
    return this.errorCode;
  }

  static CreateOk() {
    return new this(null);
  }

  static CreateErrorForbidden() {
    return new this(UseCaseError.Forbidden);
  }

  static CreateErrorNotFound() {
    return new this(UseCaseError.NotFound);
  }

  static CreateErrorUnknown() {
    return new this(UseCaseError.Unknown);
  }
}
