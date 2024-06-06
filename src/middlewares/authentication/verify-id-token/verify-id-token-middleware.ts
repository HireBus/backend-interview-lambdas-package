import { type AuthenticatedAPIGatewayEventType } from "../types-for-authentication";

export const verifyIdTokenMiddleWare = {
  before: async ({ event }: { event: AuthenticatedAPIGatewayEventType }) => {
    // Assume this works
  },
};
