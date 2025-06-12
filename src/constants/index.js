import path from 'node:path';

export const SORT_ORDER = ['asc', 'desc'];

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TAMPLATES_DIR = path.resolve('src', 'templates');
