import { destroyAllKyselyDbConnections } from '@core/db/utils/kysely-client-pool';
import { type makeUnauthorizedError } from '@core/services/errors';

export async function handleThrowErrorResponse(
  errorResponseObj: ReturnType<typeof makeUnauthorizedError>
) {
  await destroyAllKyselyDbConnections();
  throw errorResponseObj;
}
