import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './dto/JWTPayload';
import { UserRepositoryDB } from '../repositories/user/UserDBRepository';
import { UserId } from '../../domain/user/UserId';

@Injectable()
export class AuthProvider {
  // TODO:I sacar interfaz cuando estén claros los métodos necesarios
  constructor(private readonly userRepositoryDB: UserRepositoryDB, private readonly jwtService: JwtService) {}

  async validateUser(userId: UserId, pass: string): Promise<boolean> {
    const user = await this.userRepositoryDB.findOne(userId);
    return user && (await user.validatePassword(pass));
  }

  async generateAccessToken(userId: UserId) {
    const user = await this.userRepositoryDB.findOne(userId);
    const payload: JWTPayload = { userId: user.id.value };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
