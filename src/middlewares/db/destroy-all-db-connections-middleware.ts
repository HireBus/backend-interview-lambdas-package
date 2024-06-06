import { destroyAllKyselyDbConnections } from '@core/db/utils/kysely-client-pool';

export const destroyAllKyselyDbConnectionsMiddleWare = {
  after: async () => {
    await destroyAllKyselyDbConnections();
  },
};
