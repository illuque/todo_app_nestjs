import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuardWithExceptions } from './infrastructure/auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuardWithExceptions(reflector));

  await app.listen(3000);
}

bootstrap();
