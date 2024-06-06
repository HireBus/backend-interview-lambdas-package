import { type KyselyClient } from '@core/db/connections';

export const destroyDbClientMiddleware = {
  after: async ({ 
    dbClient, 
    legacyDbClient 
  }: { 
    dbClient?: KyselyClient | null;
    legacyDbClient?: KyselyClient | null;
  }) => {
    if (dbClient) {
      await dbClient.destroy();
    }
    if (legacyDbClient) {
      await legacyDbClient.destroy();
    }
  },
};
