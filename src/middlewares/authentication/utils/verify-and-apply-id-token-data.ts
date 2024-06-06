import { makeUnauthorizedError } from '@core/services/errors';
import { logger } from '@core/utils/commons';
import { X_HEADERS } from 'constants/http';
import { handleThrowErrorResponse } from 'middlewares/utils/handle-throw-error-response';
import { type AuthenticatedAPIGatewayEventType } from '../types-for-authentication';
import { getIdTokenData } from './get-id-token-data';

export async function verifyAndApplyIdTokenData({
  event,
  requireUserId,
}: {
  event: AuthenticatedAPIGatewayEventType;
  requireUserId: boolean;
}) {
  const idToken = event.headers[X_HEADERS.IdToken]?.trim() ?? '';
  const proxyUserId = event.headers[X_HEADERS.ProxyUserId]?.trim() ?? '';

  const idTokenData = await tryGetIdTokenData(idToken, requireUserId);

  logger({
    path: 'lambdas/src/middlewares/authentication/verify-id-token/verify-id-token-middleware.ts',
    event: 'idTokenData',
    log: { message: 'idTokenData', idTokenData },
  });

  if (requireUserId && !idTokenData?.userId) {
    await handleThrowErrorResponse(makeUnauthorizedError('User ID is missing in the ID token'));
  }

  if (idTokenData?.superAdminId && proxyUserId) {
    idTokenData.userId = proxyUserId;
  }

  event.idTokenData = idTokenData;
}
async function tryGetIdTokenData(idToken: string, requireUserId: boolean) {
  try {
    const idTokenData = await getIdTokenData(idToken, requireUserId);
    return idTokenData;
  } catch (error) {
    await handleThrowErrorResponse(
      makeUnauthorizedError(`Invalid ID token: ${(error as Error).message}`)
    );
    throw error as Error;
  }
}

