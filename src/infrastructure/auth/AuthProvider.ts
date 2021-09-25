import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './dto/JWTPayload';
import { UserRepositoryDB } from '../repositories/user/UserDBRepository';

@Injectable()
export class AuthProvider {
  // TODO:I sacar interfaz cuando estén claros los métodos necesarios
  constructor(private readonly userRepositoryDB: UserRepositoryDB, private readonly jwtService: JwtService) {}

  async validateUser(id: string, pass: string): Promise<boolean> {
    const user = await this.userRepositoryDB.findOne(id);
    return user && (await user.validatePassword(pass));
  }

  async generateAccessToken(id: string) {
    const user = await this.userRepositoryDB.findOne(id);
    const payload: JWTPayload = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
