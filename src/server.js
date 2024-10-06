import express from 'express';
import cors from 'cors';
import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import logger from './middlewares/logger.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
const PORT = Number(env('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(logger);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
