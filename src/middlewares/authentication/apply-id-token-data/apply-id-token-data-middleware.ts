import { type AuthenticatedAPIGatewayEventType } from '../types-for-authentication';
import { verifyAndApplyIdTokenData } from '../utils/verify-and-apply-id-token-data';

export const applyIdTokenDataMiddleware = {
  before: async ({ event }: { event: AuthenticatedAPIGatewayEventType }) => {
    await verifyAndApplyIdTokenData({
      event,
      requireUserId: false,
    });
  },
};
