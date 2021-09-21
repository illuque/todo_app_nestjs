import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthProvider } from '../auth/auth.provider.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '../../interfaces/controllers/auth.controller';
import { UserModule } from './user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';

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
  providers: [AuthProvider, JwtStrategy],
  exports: [AuthProvider],
})
export class AuthModule {}
