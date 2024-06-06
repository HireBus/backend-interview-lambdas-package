import { createKyselyDbConnection } from '@core/db/connections';
import { assertNoDbConnectionsRemaining } from '@core/db/utils/assert-no-db-connections-remaining';
import {
  destroyAllKyselyDbConnections,
  getNumKyselyDbConnections,
} from '@core/db/utils/kysely-client-pool';
import * as FetchUserModule from '@core/services/users/fetch-user';
import { type User } from '@core/types/user';
import { deleteAllOfTable } from '@core/utils/delete-all-of-table';
import { defaultTestHeaders } from 'middlewares/authentication/test-utils/default-test-headers';
import { verifyIdToken } from 'middlewares/authentication/verify-id-token/verify-id-token';
import { destroyDbClientMiddleware } from 'middlewares/db/destroy-db-client-middleware';
import * as MakeMiddlewareCompliantModule from 'middlewares/utils/make-middleware-compliant';
import { createApiHandler } from 'utils/api-handler/create-api-handler';
import { makeAPIResponse } from 'utils/http';
import { defaultLambdaContext } from 'utils/test-utils/default-lambda-context';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

vi.mock('middlewares/authentication/verify-id-token/verify-id-token', () => ({
  verifyIdToken: vi.fn(() => ({
    userId: '1',
    email: 'some-email@gmail.com',
  })),
}));

const db = createKyselyDbConnection();

describe(createApiHandler.name, () => {
  vi.spyOn(FetchUserModule, 'fetchUser').mockImplementation(async () => undefined);

  afterAll(async () => {
    await db.destroy();
  });

  const dummyContext = defaultLambdaContext;

  beforeEach(async () => {
    await deleteAllOfTable('users');
  });

  it('can execute', async () => {
    createApiHandler({
      schema: {
        body: z.object({
          id: z.string(),
        }),
      },
      handler: async ({ body }) => makeAPIResponse({ type: 'Success', data: body }),
      type: 'public',
    });
  });

  it('should return Bad Request if the body is not valid', async () => {
    const apiHandler = createApiHandler({
      schema: {
        body: z.object({
          id: z.number(),
        }),
      },
      handler: async ({ body }) => makeAPIResponse({ type: 'Success', data: body }),
      type: 'public',
    });

    const result = await apiHandler(
      {
        body: JSON.stringify({ id: 'This is not a number!' }),
        headers: defaultTestHeaders,
      },
      dummyContext
    );

    expect(result.statusCode).toBe(400);
  });

  it('should return the result we are looking for', async () => {
    const expectedResults = {
      id: 1,
      name: 'Ricky',
      favoriteColor: 'blue',
    };

    const fetchUserHandler = createApiHandler({
      schema: { body: z.object({ id: z.number() }) },
      handler: async () => makeAPIResponse({ type: 'Success', data: expectedResults }),
      type: 'public',
    });

    const response = await fetchUserHandler(
      { body: JSON.stringify({ id: 1 }), headers: defaultTestHeaders },
      dummyContext
    );

    const responseBody = JSON.parse((response as { body: string }).body);

    expect(response.statusCode).toBe(200);
    expect(responseBody.message).toBe('Success');
    expect(responseBody.data).toEqual(expectedResults);
  });

  it('should validate the correct event based on the schema', async () => {
    let eventSpy: Record<string, unknown> = {};

    const mockEventWithExtraData = {
      body: JSON.stringify({
        name: 'Ricky',
        age: 25,
      }),
      queryStringParameters: {
        filter: 'test',
        sort: 'asc',
      },
      pathParameters: {
        id: 1,
      },
      headers: defaultTestHeaders,
    };

    const expectedValidatedEvent = {
      body: {
        name: 'Ricky',
      },
      queryStringParameters: {
        filter: 'test',
      },
      pathParameters: {
        id: 1,
      },
      headers: defaultTestHeaders,
    };

    const apiHandler = createApiHandler({
      schema: {
        body: z.object({
          name: z.string(),
        }),
        queryStringParameters: z.object({
          filter: z.string(),
        }),
        pathParameters: z.object({
          id: z.number(),
        }),
      },
      handler: async event => {
        eventSpy = event;
        return makeAPIResponse({ type: 'Success', data: null });
      },
      type: 'public',
    });

    await apiHandler(mockEventWithExtraData, dummyContext);

    expect(eventSpy).toMatchObject(expectedValidatedEvent);
  });

  it('should return unauthorized response if is not a hirebus user', async () => {
    const apiHandler = createApiHandler({
      schema: {
        body: z.object({
          id: z.number(),
        }),
      },
      handler: async ({ body }) => makeAPIResponse({ type: 'Success', data: body }),
      type: 'private',
    });

    const response = await apiHandler(
      {
        body: JSON.stringify({ id: 1 }),
        headers: defaultTestHeaders,
      },
      dummyContext
    );
    expect(response.statusCode).toBe(401);
  });

  it('should destroy all db connections after the handler is done', async () => {
    const apiHandler = createApiHandler({
      schema: {
        body: z.object({
          id: z.string(),
        }),
      },
      handler: async ({ body }) => {
        for (let i = 0; i < 3; i++) {
          createKyselyDbConnection();
        }
        return makeAPIResponse({ type: 'Success', data: body });
      },
      type: 'public',
    });

    await apiHandler(
      {
        body: JSON.stringify({ id: '1' }),
        headers: defaultTestHeaders,
      },
      dummyContext
    );

    await assertNoDbConnectionsRemaining();
  });

  it('should allow access if the user is a valid HireBus user', async () => {
    // await createTestUser(db);
    vi.spyOn(FetchUserModule, 'fetchUser').mockResolvedValueOnce({
      id: 1,
      email: 'some email',
    } as User);

    const userId = '1';

    vi.mocked(verifyIdToken).mockResolvedValueOnce({
      userId,
      email: 'some email',
    });

    const apiHandler = createApiHandler({
      schema: { body: z.object({ id: z.string() }) },
      handler: async ({ body }) => makeAPIResponse({ type: 'Success', data: body }),
      type: 'private',
    });

    const response = await apiHandler(
      {
        body: JSON.stringify({ id: userId }),
        headers: defaultTestHeaders,
      },
      dummyContext
    );

    expect(response.statusCode).toBe(200);
  });

  it('should return unauthorized if the user is not a valid HireBus user', async () => {
    vi.spyOn(FetchUserModule, 'fetchUser').mockResolvedValueOnce({
      id: 1,
      email: 'some email',
    } as User);

    // not id 1
    const userId = '5';

    vi.mocked(verifyIdToken).mockResolvedValueOnce({
      userId,
      email: 'some email',
    });

    const apiHandler = createApiHandler({
      schema: { body: z.object({ id: z.string() }) },
      handler: async ({ body }) => makeAPIResponse({ type: 'Success', data: body }),
      type: 'private',
    });

    const response = await apiHandler(
      {
        body: JSON.stringify({ id: userId }),
        headers: defaultTestHeaders,
      },
      dummyContext
    );

    expect(response.statusCode).toBe(401);
  });

  it('should create a dbClient correctly and provide it to the handler', async () => {
    vi.spyOn(FetchUserModule, 'fetchUser').mockResolvedValueOnce({
      id: 1,
      email: 'some email',
    } as User);

    await destroyAllKyselyDbConnections();

    vi.mocked(verifyIdToken).mockResolvedValueOnce({
      userId: '1',
      email: 'some email',
    });

    const apiHandler = createApiHandler({
      schema: { body: z.object({ id: z.string() }) },
      handler: async ({ body, dbClient, legacyDbClient }) => {
        expect(getNumKyselyDbConnections()).toBe(2);
        expect(dbClient).toBeDefined();
        expect(legacyDbClient).toBeDefined();
        return makeAPIResponse({ type: 'Success', data: body });
      },
      type: 'private',
    });

    const response = await apiHandler(
      {
        body: JSON.stringify({ id: '1' }),
        headers: defaultTestHeaders,
      },
      dummyContext
    );

    expect(response.statusCode).toBe(200);

    expect(getNumKyselyDbConnections()).toBe(0);
  });

  it('should call the destroyDbClientMiddleware after the handler is done', async () => {
    const spy = vi.spyOn(destroyDbClientMiddleware, 'after');

    vi.spyOn(FetchUserModule, 'fetchUser').mockResolvedValueOnce({
      id: 1,
      email: 'some email',
    } as User);

    await destroyAllKyselyDbConnections();

    vi.mocked(verifyIdToken).mockResolvedValueOnce({
      userId: '1',
      email: 'some email',
    });

    const apiHandler = createApiHandler({
      schema: { body: z.object({ id: z.string() }) },
      handler: async () => makeAPIResponse({ type: 'Success' }),
      type: 'private',
    });

    await apiHandler(
      {
        body: JSON.stringify({ id: '1' }),
        headers: defaultTestHeaders,
      },
      dummyContext
    );

    expect(spy).toHaveBeenCalled();
  });

  it('should make every auth middleware compliant', () => {
    const spy = vi.spyOn(MakeMiddlewareCompliantModule, 'makeMiddlewareCompliant');

    createApiHandler({
      schema: { body: z.object({ id: z.string() }) },
      handler: async () => makeAPIResponse({ type: 'Success' }),
      type: 'private',
    });

    expect(spy).toHaveBeenCalled();
  });

  it('should not make other auth middlewares compliant', () => {
    const spy = vi.spyOn(MakeMiddlewareCompliantModule, 'makeMiddlewareCompliant');

    createApiHandler({
      schema: { body: z.object({ id: z.string() }) },
      handler: async () => makeAPIResponse({ type: 'Success' }),
      type: 'public',
    });

    expect(spy).not.toHaveBeenCalled();
  });
});
