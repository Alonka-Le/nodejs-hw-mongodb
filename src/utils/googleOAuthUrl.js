import { OAuth2Client } from 'google-auth-library';
import { env } from './env.js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';

const clientId = env('GOOGLE_CLIENT_ID');
const clientSecret = env('GOOGLE_CLIENT_SECRET');

const oauthConfigPath = path.resolve('google-oauth.json');
const oauthConfig = JSON.parse(await readFile(oauthConfigPath));
const redirectUri = oauthConfig.web.redirect_uris[0];

const googleOAuthClinet = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri,
});

export const validateCode = async (code) => {
  const response = await googleOAuthClinet.getToken(code);
  console.log('OAuth Response:', response);

  if (!response.tokens.id_token) {
    throw createHttpError(401);
  }
  const tiket = await googleOAuthClinet.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return tiket;
};

export const generateGoogleOAuthUrl = () => {
  const url = googleOAuthClinet.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

  return url;
};
