import { extname } from 'path';
import { PICTURES_PATH } from './FileConstants';
import { diskStorage } from 'multer';

export class PictureFileStore {
  static buildDiskStorage() {
    return diskStorage({
      destination: `./${PICTURES_PATH}`,
      filename: this.generateFileName(),
    });
  }

  private static generateFileName() {
    return (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      return cb(null, `${randomName}${extname(file.originalname)}`);
    };
  }
}
