import { Controller, Get, Param, Res } from '@nestjs/common';
import { Public } from '../../infrastructure/auth/auth.public.decorator';
import { PICTURES_PATH } from '../../infrastructure/constants';

@Controller('pictures')
export class PictureController {
  @Public()
  @Get('/:id')
  async servePicture(@Param('id') fileId, @Res() res): Promise<void> {
    res.sendFile(fileId, {
      root: PICTURES_PATH,
    });
  }
}
