import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuardWithExceptions extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isNoAuth = this.reflector.get<boolean>(
      'no-auth',
      context.getHandler(),
    );

    if (isNoAuth) {
      return true;
    }

    return super.canActivate(context);
  }
}
