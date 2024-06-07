import { type AuthenticatedAPIGatewayEventType } from "middlewares/authentication/types-for-authentication";
import { type AuthMiddleware } from "middlewares/authorization/auth-middleware-type";

export const verifyIsHirebusUserMiddleware: AuthMiddleware = {
  before: async ({ event }: { event: AuthenticatedAPIGatewayEventType }) => {
    // assume this works
  },
};
