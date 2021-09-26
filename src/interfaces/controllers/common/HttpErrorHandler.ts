import { BaseNotFoundError } from '../../../application/usecase/common/errors/BaseNotFoundError';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseForbiddenError } from '../../../application/usecase/common/errors/BaseForbiddenError';
import { BaseBadRequestError } from '../../../application/usecase/common/errors/BaseBadRequestError';
import { BaseGenericError } from '../../../application/usecase/common/errors/BaseGenericError';

export class HttpErrorHandler {
  private static readonly logger = new Logger(HttpErrorHandler.name);

  static buildHttpExceptionFromDomainError(e: Error): Error {
    if (e instanceof BaseNotFoundError) {
      return new NotFoundException(e.message);
    }
    if (e instanceof BaseForbiddenError) {
      return new ForbiddenException(e.message);
    }
    if (e instanceof BaseBadRequestError) {
      return new BadRequestException(e.message);
    }
    if (e instanceof BaseGenericError) {
      return new InternalServerErrorException(e.message);
    }

    this.logger.error('Unexpected e on controller', e.stack);
    return new InternalServerErrorException('Unknown error happened');
  }
}
