import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('no-auth', true);
