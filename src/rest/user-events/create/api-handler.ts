import { createBulkUserEvents } from '@core/services/user-events/create-bulk-user-events';
import { verifyIdTokenMiddleWare } from 'middlewares/authentication/verify-id-token/verify-id-token-middleware';
import { type AuthMiddleware } from 'middlewares/authorization/auth-middleware-type';
import { userEventsAuthMiddleware } from 'middlewares/authorization/user-events/user-events-auth-middleware';
import { createApiHandler } from 'utils/api-handler/create-api-handler';
import { makeAPIResponse } from 'utils/http';
import { createBulkUserEventsApiSchema } from './schema';

export function makeCreateBulkUserEventsApiHandler(
  authMiddlewares: ReadonlyArray<AuthMiddleware> = [
    verifyIdTokenMiddleWare,
    userEventsAuthMiddleware as AuthMiddleware,
  ]
) {
  return createApiHandler({
    authMiddlewares,
    schema: createBulkUserEventsApiSchema,
    handler: async ({ dbClient, body }) => {
      const validValues = body.user_events.map(userEvent => ({
        user_id: userEvent.user_id,
        description: userEvent.description,
        timestamp: new Date(userEvent.timestamp),
      }));

      await createBulkUserEvents(dbClient, validValues);

      return makeAPIResponse({
        type: 'Success',
      });
    },
    type: 'private',
  });
}

export const createBulkUserEventsApiHandler = makeCreateBulkUserEventsApiHandler();
