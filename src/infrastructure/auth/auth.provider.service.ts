import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './dto/auth.jwt.payload';
import { UserDB } from '../repositories/user/user.db';
import { RepositoryDB } from '../../application/ports/repository.service';

@Injectable()
export class AuthProvider {
  // TODO:I sacar interfaz cuando estén claros los métodos necesarios
  constructor(
    private readonly userRepositoryDB: RepositoryDB<number, UserDB>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(id: number, pass: string): Promise<boolean> {
    const user = await this.userRepositoryDB.findOne(id);
    return user && (await user.validatePassword(pass));
  }

  async generateAccessToken(id: number) {
    const user = await this.userRepositoryDB.findOne(id);
    const payload: JWTPayload = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
