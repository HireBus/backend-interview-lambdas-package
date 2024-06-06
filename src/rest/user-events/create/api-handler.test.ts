import { verifyIdTokenMiddleWare } from 'middlewares/authentication/verify-id-token/verify-id-token-middleware';
import { type AuthMiddleware } from 'middlewares/authorization/auth-middleware-type';
import { userEventsAuthMiddleware } from 'middlewares/authorization/user-events/user-events-auth-middleware';
import * as createApiHandlerModule from 'utils/api-handler/create-api-handler';
import { describe, expect, it, vi } from 'vitest';
import { createBulkUserEventsApiSchema } from './schema';

const mocks = vi.hoisted(() => ({
  createBulkUserEventsHandler: vi.fn(),
}));

vi.mock('./handler', () => ({
  createBulkUserEventsHandler: mocks.createBulkUserEventsHandler,
}));

describe('createBulkUserEventsApiHandler', async () => {
  it('should call "createApiHandler" with correct arguments', async () => {
    const spy = vi.spyOn(createApiHandlerModule, 'createApiHandler');

    await import('./api-handler');

    expect(spy).toHaveBeenCalled();
    expect(spy).lastCalledWith(
      expect.objectContaining({
        authMiddlewares: [verifyIdTokenMiddleWare, userEventsAuthMiddleware as AuthMiddleware],
        schema: createBulkUserEventsApiSchema,
        type: 'private',
      })
    );
  });
});
