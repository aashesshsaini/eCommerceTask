import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import '../config/passport';
import { USER_TYPE, ERROR_MESSAGES, STATUS_CODES } from '../config/appConstant';
import { AuthFailedError } from '../utils/error';

const verifyCallback = (req: Request, resolve: any, reject: any, expectedRole: string) => async (err: any, token: any, info: any) => {
  if (err || info || !token) {
    console.log('errrrrrrrrrrrr');
    return reject(new AuthFailedError());
  }

  if (expectedRole && token.role !== expectedRole) {
    console.log(token, 'ROLE>>>>>>>>');
    return reject(
      new AuthFailedError(
        ERROR_MESSAGES.UNAUTHORIZED,
        STATUS_CODES.AUTH_FAILED
      )
    );
  }

  if (token.role === USER_TYPE.ADMIN && !token.admin) {
    return reject(new AuthFailedError());
  }
  if (token.role === USER_TYPE.USER && !token.user) {
    console.log(token.user);
    return reject(new AuthFailedError());
  }
  if (token.role === USER_TYPE.USER) {
    if (!token.user) {
      return reject(new AuthFailedError());
    }
    if (token.user.isDeleted) {
      return reject(
        new AuthFailedError(
          ERROR_MESSAGES.ACCOUNT_DELETED,
          STATUS_CODES.ACTION_FAILED
        )
      );
    }
    if (token.user.isBlocked) {
      return reject(
        new AuthFailedError(
          ERROR_MESSAGES.ACCOUNT_BLOCKED,
          STATUS_CODES.ACTION_FAILED
        )
      );
    }
  }

  if (token.role === USER_TYPE.ADMIN) {
    if (!token.admin) {
      return reject(new AuthFailedError());
    }
    if (token.admin.isDeleted) {
      return reject(
        new AuthFailedError(
          ERROR_MESSAGES.ACCOUNT_DELETED,
          STATUS_CODES.ACTION_FAILED
        )
      );
    }
  }

  req.token = token;
  return resolve();
};

const auth = (expectedRole: string, option?: boolean) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization && option) {
    return next();
  }
  console.log(expectedRole, "expectedRole........")
  return new Promise(async (resolve, reject) => {
    await passport.authenticate(
      'jwt',
      { session: false },
      verifyCallback(req, resolve, reject, expectedRole)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
