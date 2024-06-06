import { describe, it, expect, vi, afterEach } from 'vitest';
import { type AuthenticatedAPIGatewayEventType } from 'middlewares/authentication/types-for-authentication';
import { makeMiddlewareCompliant } from './make-middleware-compliant';

const mocks = vi.hoisted(() => ({
  destroyAllKyselyDbConnections: vi.fn(),
}));

vi.mock('@core/db/utils/kysely-client-pool', () => ({
  destroyAllKyselyDbConnections: mocks.destroyAllKyselyDbConnections,
}));

describe(makeMiddlewareCompliant.name, () => {

  afterEach(() => {
    vi.resetAllMocks();
  });

  const dummyEvent = {} as AuthenticatedAPIGatewayEventType;

  it('calls the before method of the middleware if provided', async () => {
    const mockBefore = vi.fn();
    const middleware = makeMiddlewareCompliant({ before: mockBefore });
    await middleware.before?.({ event: dummyEvent });

    expect(mockBefore).toHaveBeenCalled();
    expect(mocks.destroyAllKyselyDbConnections).not.toHaveBeenCalled();
  });

  it('calls the after method of the middleware if provided', async () => {
    const mockAfter = vi.fn();
    const middleware = makeMiddlewareCompliant({ after: mockAfter });
    await middleware.after?.({ event: dummyEvent });

    expect(mockAfter).toHaveBeenCalled();
    expect(mocks.destroyAllKyselyDbConnections).not.toHaveBeenCalled();
  });

  it('destroys all Kysely database connections and rethrows the error if an error occurs in before', async () => {
    const mockError = new Error('Test Error');
    const mockBefore = vi.fn().mockRejectedValue(mockError);
    const middleware = makeMiddlewareCompliant({ before: mockBefore });

    await expect(middleware.before?.({ event: dummyEvent })).rejects.toThrow(mockError);
    expect(mocks.destroyAllKyselyDbConnections).toHaveBeenCalled();
  });

  it('destroys all Kysely database connections and rethrows the error if an error occurs in after', async () => {
    const mockError = new Error('Test Error');
    const mockAfter = vi.fn().mockRejectedValue(mockError);
    const middleware = makeMiddlewareCompliant({ after: mockAfter });


    await expect(middleware.after?.({ event: dummyEvent })).rejects.toThrow(mockError);

    expect(mocks.destroyAllKyselyDbConnections).toHaveBeenCalled();
  });
});
