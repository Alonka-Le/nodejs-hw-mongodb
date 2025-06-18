import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  logInUserShema,
  registerUserSchema,
  userLoginWithGoogleOAuthSchema,
} from '../validation/users.js';
import * as authController from '../controllers/auth.js';
import {
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(authController.registerController),
);

authRouter.get(
  '/get-oauth-url',
  ctrlWrapper(authController.getGoogleOauthUrlController),
);

authRouter.post(
  '/confirm-google',
  validateBody(userLoginWithGoogleOAuthSchema),
  ctrlWrapper(authController.loginWithGoogleOAuthController),
);

authRouter.get('/verify', ctrlWrapper(authController.verifyController));

authRouter.post(
  '/login',
  validateBody(logInUserShema),
  ctrlWrapper(authController.loginController),
);

authRouter.post('/refresh', ctrlWrapper(authController.refreshController));
export default authRouter;

authRouter.post('/logout', ctrlWrapper(authController.logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authController.requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController),
);
