import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './dto/JWTPayload';
import { UserRepositoryDB } from '../repositories/user/UserDBRepository';
import { UserId } from '../../domain/user/UserId';
import { AuthProvider } from '../../interfaces/controllers/ports/AuthProvider';

@Injectable()
export class JWTAuthProvider implements AuthProvider {
  constructor(private readonly userRepositoryDB: UserRepositoryDB, private readonly jwtService: JwtService) {}

  async authorizeUser(userId: UserId, pass: string): Promise<JWTTokenResponse> {
    const user = await this.userRepositoryDB.findOne(userId);
    const authorized = user && (await user.validatePassword(pass));
    if (authorized) {
      return this.generateAccessToken(userId);
    }

    return null;
  }

  private async generateAccessToken(userId: UserId) {
    const user = await this.userRepositoryDB.findOne(userId);
    const payload: JWTPayload = { userId: user.id.value };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

class JWTTokenResponse {
  access_token: string;
}
