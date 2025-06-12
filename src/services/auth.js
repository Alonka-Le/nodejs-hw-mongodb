import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import { randomBytes } from 'crypto';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';
import { createJwtToken, verifyToken } from '../utils/jwt.js';
import SessionCollection from '../db/models/Session.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { SMTP, TAMPLATES_DIR } from '../constants/index.js';
import { sendMail } from '../utils/sendMail.js';
import path from 'node:path';
import * as fs from 'node:fs/promises';
import handlebars from 'handlebars';
const varifyEmailTamplatePath = path.join(
  TAMPLATES_DIR,
  'varify-templates.html',
);
const verifyEmailTemplateSource = await fs.readFile(
  varifyEmailTamplatePath,
  'utf-8',
);

const appDomain = env('APP_DOMAIN');

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifeTime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifeTime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const data = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });
  delete data._doc.password;

  const jwtToken = createJwtToken({ sub: data._id, email: data.email });

  const template = handlebars.compile(verifyEmailTemplateSource);

  console.log(appDomain, jwtToken);
  const html = template({ appDomain, jwtToken });
  const varifyEmail = {
    to: email,
    subject: 'Verify Email',
    html,
  };

  await sendMail(varifyEmail);
  return data._doc;
};
export const verify = async (token) => {
  const { data, error } = verifyToken(token);
  if (error) {
    throw createHttpError(401, 'Token invalid');
  }

  const user = await UserCollection.findOne({ email: data.email });
  if (user.verify) {
    throw createHttpError(401, 'Email already verify');
  }
  console.log('Decoded token data:', data);
  await UserCollection.findOneAndUpdate({ _id: user._id }, { verify: true });
};

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  if (!user.verify) {
    throw createHttpError(401, 'Email not verify');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const createData = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...createData,
  });

  return userSession;
};

export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }
  if (new Date() > oldSession.accessTokenValidUntil) {
    throw createHttpError(401, 'Access token expired');
  }
  await SessionCollection.deleteOne({ _id: sessionId });

  const createData = createSession();

  const userSession = await SessionCollection.create({
    userId: oldSession.userId,
    ...createData,
  });

  return userSession;
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};
export const findUser = (filter) => UserCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = createJwtToken({ sub: user._id, email: user.email });

  const frontendDomain = env('APP_DOMAIN');

  const resetLink = `${frontendDomain}/reset-password?token=${resetToken}`;

  try {
    await sendMail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password!</p>`,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};
// export const resetPassword = async (password, token) => {
//   let decoded;
//   try {
//     decoded = jwt.verify(token, env('JWT_SECRET'));

//     const user = await UserCollection.findOne({
//       _id: decoded.sub,
//       email: decoded.email,
//     });
//     if (!user) {
//       throw createHttpError(404, 'User not found');
//     }

//     const encryptedPassword = await bcrypt.hash(password, 10);

//     await UserCollection.findOneAndUpdate(
//       { _id: user.id },
//       { password: encryptedPassword },
//     );
//   } catch (error) {
//     // if (
//     //   error.name === 'TokenExpiredError' ||
//     //   error.name === 'JsonWebTokenError'
//     // ) {
//     //   throw createHttpError(401, 'Token is expired or invalid.');
//     // }

//     throw error;
//   }
// };
export const resetPassword = async ({ token, password }) => {
  if (!token || !password) {
    throw createHttpError(400, 'Token and password are required');
  }

  const { data: payload, error } = verifyToken(token);
  if (error) {
    throw createHttpError(401, 'Invalid or expired token');
  }

  console.log('Decoded token:', payload);

  const user = await UserCollection.findOne({
    email: payload.email,
    _id: payload.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  console.log('User found:', user.email);

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { $set: { password: encryptedPassword } },
  );

  return { message: 'Password successfully reset!' };
};
