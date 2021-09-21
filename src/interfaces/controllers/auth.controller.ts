import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthProvider } from '../../infrastructure/auth/auth.provider.service';
import { LoginDTO } from './dto/login.dto';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthProvider) {}

  @Post()
  async login(@Body() loginDTO: LoginDTO): Promise<{ access_token: string }> {
    const { userId, password } = loginDTO;

    const valid = await this.authService.validateUser(userId, password);
    if (!valid) {
      throw new UnauthorizedException();
    }

    return await this.authService.generateAccessToken(userId);
  }
}
