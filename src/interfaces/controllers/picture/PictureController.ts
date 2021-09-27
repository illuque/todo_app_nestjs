import { Controller, Get, Param, Res } from '@nestjs/common';
import { Public } from '../../../infrastructure/auth/AuthPublicDecorator';
import { PICTURES_PATH } from '../../../infrastructure/file/FileConstants';

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
