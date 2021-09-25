import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthProvider } from '../infrastructure/auth/AuthProvider';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '../interfaces/controllers/AuthController';
import { UserModule } from './UserModule';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from '../infrastructure/auth/JWTStrategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthProvider, JWTStrategy],
  exports: [AuthProvider],
})
export class AuthModule {}
