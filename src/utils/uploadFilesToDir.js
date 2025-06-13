import * as fs from 'node:fs/promises';
import * as path from 'path';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';
import { env } from './env.js';

const saveFileToUploadDir = async (file) => {
  const oldPath = path.join(TEMP_UPLOAD_DIR, file.filename);
  const newPath = path.join(UPLOAD_DIR, file.filename);

  try {
    await fs.rename(oldPath, newPath);
    return `${env('APP_DOMEIN')}/upload/${file.filename}`;
  } catch (error) {
    console.error('Error saving file to upload directory:', error);
    throw createHttpError(
      500,
      'Failed to save the file, please try again later.',
    );
  }
};

export default saveFileToUploadDir;
