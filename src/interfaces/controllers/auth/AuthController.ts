import { Body, Controller, Inject, Post, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './LoginInput';
import { Public } from '../../../infrastructure/auth/AuthPublicDecorator';
import { UserId } from '../../../domain/user/UserId';
import { AuthProvider } from './ports/AuthProvider';

@Controller('login')
export class AuthController {
  constructor(@Inject('AuthProvider') private authService: AuthProvider) {}

  @Public()
  @Post()
  async login(@Body() loginDTO: LoginInput): Promise<{ access_token: string }> {
    const { userId: uid, password } = loginDTO;

    const userId = new UserId(uid);

    const authorizerResponse = await this.authService.authorizeUser(userId, password);
    if (!authorizerResponse) {
      throw new UnauthorizedException();
    }

    return authorizerResponse;
  }
}
