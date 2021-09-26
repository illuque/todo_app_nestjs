import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from './dto/JWTPayload';
import { UserRepositoryDB } from '../repositories/user/UserDBRepository';
import { User } from '../../domain/user/User';
import { UserId } from '../../domain/user/UserId';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepositoryDB: UserRepositoryDB) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    const userId = new UserId(payload.userId);
    const user = await this.userRepositoryDB.findOne(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
