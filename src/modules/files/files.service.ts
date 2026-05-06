import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  async uploadFile(file: Express.Multer.File) {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const uploadPath = path.join(process.cwd(), 'uploads', fileName);

    return new Promise((resolve, reject) => {
      const stream = createWriteStream(uploadPath);
      stream.write(file.buffer);
      stream.end();
      stream.on('finish', () =>
        resolve({ fileName, path: `/uploads/${fileName}` }),
      );
      stream.on('error', (err) => reject(err));
    });
  }
}
