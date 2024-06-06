import { makeUnauthorizedError } from '@core/services/errors';
import { logger } from '@core/utils/commons';
import { type IdTokenData } from '../types-for-authentication';
import { verifyIdToken } from '../verify-id-token/verify-id-token';

export const verifyToken = async (idToken: string): Promise<IdTokenData | undefined> => {
  try {
    return await verifyIdToken(idToken);
  } catch (error) {
    logger({
      path: 'lambdas/src/middlewares/authentication/utils/verify-token.ts',
      event: 'verifyIdToken',
      log: { message: 'Error verifying token', error: JSON.stringify(error) },
    });
    throw makeUnauthorizedError('Error verifying token');
  }
};
