import * as fs from 'node:fs/promises';

const createDirIfNotExist = async (url) => {
  try {
    await fs.access(url);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};

export default createDirIfNotExist;
