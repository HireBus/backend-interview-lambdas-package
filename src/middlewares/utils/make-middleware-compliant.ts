import { destroyAllKyselyDbConnections } from "@core/db/utils/kysely-client-pool";
import { type AuthenticatedAPIGatewayEventType } from "middlewares/authentication/types-for-authentication";

export type MiddlewareGeneralType = {
  before?: ({ event }: { event: AuthenticatedAPIGatewayEventType }) => Promise<void>;
  after?: ({ event }: { event: AuthenticatedAPIGatewayEventType }) => Promise<void>;
}

export function makeMiddlewareCompliant<
  Middleware extends MiddlewareGeneralType
>(middleWare: Middleware): MiddlewareGeneralType {
  return {
    ...middleWare,
    // Allowing this for now
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    before: async (beforeArgs: Parameters<Middleware['before']>[0]) => {
      try {
        await middleWare.before?.(beforeArgs);
      } catch (error) {
        await destroyAllKyselyDbConnections();
        throw error;
      }
    },
    // Allowing this for now
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    after: async (afterArgs: Parameters<Middleware['after']>[0]) => {
      try {
        await middleWare.after?.(afterArgs);
      } catch (error) {
        await destroyAllKyselyDbConnections();
        throw error;
      }
    },
  } as Middleware;
}