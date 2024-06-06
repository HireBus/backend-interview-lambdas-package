import { type AuthenticatedAPIGatewayEventType } from 'middlewares/authentication/types-for-authentication';

export type AuthMiddleware<TBody = Record<string, unknown>> = {
  before: ({
    event,
  }: {
    event: AuthenticatedAPIGatewayEventType & {
      body?: TBody;
    };
  }) => Promise<unknown>;
};
