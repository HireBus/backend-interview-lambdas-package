import { describe, expect, vi, it } from "vitest";
import { type AuthenticatedAPIGatewayEventType } from "middlewares/authentication/types-for-authentication";
import { addDbClientMiddleware } from "./add-db-client-middleware";

const defaultStubDbClient = expect.anything();

const mocks = vi.hoisted(() => ({
  createDbKyselyClient: vi.fn(),
  createLegacyDbKyselyClient: vi.fn()
}));

vi.mock('@core/db/clients/create-db-kysely-client', () => ({
  createDbKyselyClient: mocks.createDbKyselyClient
}));

vi.mock('@core/db/clients/create-legacy-db-kysely-client', () => ({
  createLegacyDbKyselyClient: mocks.createLegacyDbKyselyClient
}));

describe('addDbClientMiddleware', () => {
  const dbClient = {
    name: 'dbClient'
  } as typeof defaultStubDbClient;

  const legacyDbClient = {
    name: 'legacyDbClient'
  } as typeof defaultStubDbClient;

  it('should apply both db clients to the event', async () => {

    mocks.createDbKyselyClient.mockReturnValueOnce(dbClient);
    mocks.createLegacyDbKyselyClient.mockReturnValueOnce(legacyDbClient);

    const event = {} as AuthenticatedAPIGatewayEventType;

    expect(event.dbClient).toBeUndefined();
    expect(event.legacyDbClient).toBeUndefined();

    await addDbClientMiddleware.before({ event });

    expect(event.dbClient).toBe(dbClient);
    expect(event.legacyDbClient).toBe(legacyDbClient);
  })
}); 