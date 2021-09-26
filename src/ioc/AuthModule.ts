import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWTAuthProvider } from '../infrastructure/auth/JWTAuthProvider';
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
  providers: [{ provide: 'AuthProvider', useClass: JWTAuthProvider }, JWTStrategy],
  exports: [{ provide: 'AuthProvider', useClass: JWTAuthProvider }],
})
export class AuthModule {}
