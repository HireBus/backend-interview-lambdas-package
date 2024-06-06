import { createDbKyselyClient } from '@core/db/clients/create-db-kysely-client';
import { createLegacyDbKyselyClient } from '@core/db/clients/create-legacy-db-kysely-client'
import { type AuthenticatedAPIGatewayEventType } from 'middlewares/authentication/types-for-authentication';

export const addDbClientMiddleware = {
  before: async ({ event }: { event: AuthenticatedAPIGatewayEventType }) => {
    const dbClient = createDbKyselyClient();
    const legacyDbClient = createLegacyDbKyselyClient();

    event.dbClient = dbClient;
    event.legacyDbClient = legacyDbClient;
  },
};
