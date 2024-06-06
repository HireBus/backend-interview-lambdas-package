import { makeUnauthorizedError } from '@core/services/errors';
import { verifyToken } from './verify-token';

export async function getIdTokenData(idToken: string, requireUserId: boolean) {
  let idTokenData;
  try {
    idTokenData = await verifyToken(idToken);
  } catch (error) {
    if (requireUserId) {
      throw makeUnauthorizedError('Error verifying token');
    }
  }
  return idTokenData;
}
