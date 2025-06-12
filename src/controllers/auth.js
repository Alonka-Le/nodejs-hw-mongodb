import * as authServices from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });
};
export const registerController = async (req, res) => {
  try {
    const newUser = await authServices.register(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export const verifyController = async (req, res) => {
  const { token } = req.query;
  await authServices.verify(token);

  res.json({
    status: 200,
    message: 'Email verified successfully',
    data: {},
  });
};

export const loginController = async (req, res) => {
  try {
    const session = await authServices.login(req.body);

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken, sessionId } = req.cookies;
    const session = await authServices.refreshSession({
      refreshToken,
      sessionId,
    });

    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await authServices.logout(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await authServices.requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await authServices.resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data,
  });
};
