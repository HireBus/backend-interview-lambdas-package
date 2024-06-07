import { verifyIdTokenMiddleWare } from 'middlewares/authentication/verify-id-token/verify-id-token-middleware';
import { verifyIsHirebusUserMiddleware } from 'middlewares/authentication/verify-is-hirebus-user/verify-is-hirebus-user-middleware';
import { type AuthMiddleware } from './auth-middleware-type';

export const allHireBusUsersAuthMiddlewares: ReadonlyArray<AuthMiddleware> = [
  verifyIdTokenMiddleWare,
  verifyIsHirebusUserMiddleware,
];
