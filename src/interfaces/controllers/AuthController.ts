import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthProvider } from '../../infrastructure/auth/AuthProvider';
import { LoginInput } from './dto/LoginInput';
import { Public } from '../../infrastructure/auth/AuthPublicDecorator';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthProvider) {}

  @Public()
  @Post()
  async login(@Body() loginDTO: LoginInput): Promise<{ access_token: string }> {
    const { userId, password } = loginDTO;

    const valid = await this.authService.validateUser(userId, password);
    if (!valid) {
      throw new UnauthorizedException();
    }

    return await this.authService.generateAccessToken(userId);
  }
}
