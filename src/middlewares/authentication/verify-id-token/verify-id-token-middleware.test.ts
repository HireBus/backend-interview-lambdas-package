import { expectThrowsAsync } from '@core/utils/expect-throws-async';
import { X_HEADERS } from 'constants/http';
import { defaultLambdaContext } from 'utils/test-utils/default-lambda-context';
import { describe, expect, it, vi } from 'vitest';
import { type AuthenticatedAPIGatewayEventType } from '../types-for-authentication';
import { verifyIdToken } from './verify-id-token';
import { verifyIdTokenMiddleWare } from './verify-id-token-middleware';

const dummyRequestData = {
  context: defaultLambdaContext,
  response: {},
  error: {} as Error,
  internal: {},
};

vi.mock('./verify-id-token', () => ({
  verifyIdToken: vi.fn(),
}));

describe('verifyIdTokenMiddleWare', () => {
  const middleware = verifyIdTokenMiddleWare.before;

  it('can execute without issue', async () => {
    vi.mocked(verifyIdToken).mockResolvedValueOnce({ userId: '123', email: 'bob@joe.com' });

    const event = {
      headers: {},
    } as unknown as AuthenticatedAPIGatewayEventType;

    await middleware({
      ...dummyRequestData,
      event,
    });
  });

  it('should throw unauthorized response if verification of id token fails', async () => {
    vi.mocked(verifyIdToken).mockRejectedValueOnce(new Error('test error'));

    const event = {
      headers: {},
    } as AuthenticatedAPIGatewayEventType;

    await expectThrowsAsync(async () => {
      await middleware({
        ...dummyRequestData,
        event,
      });
    });
  });

  it('should have idTokenData in event', async () => {
    const idTokenData = { userId: '123', email: 'test@gmail.com' };

    vi.mocked(verifyIdToken).mockResolvedValueOnce(idTokenData);

    const event = {
      headers: {
        [X_HEADERS.ProxyUserId]: '123',
      },
    } as unknown as AuthenticatedAPIGatewayEventType;

    await middleware({
      ...dummyRequestData,
      event,
    });

    expect(event.idTokenData).toEqual(idTokenData);
  });

  it('should have the superAdminId in idTokenData if the user is a super admin', async () => {
    const idTokenData = { userId: '123', email: 'test@gmail.com', superAdminId: '123' };

    vi.mocked(verifyIdToken).mockResolvedValueOnce(idTokenData);

    const event = {
      headers: {},
    } as unknown as AuthenticatedAPIGatewayEventType;

    await middleware({
      ...dummyRequestData,
      event,
    });

    expect(event.idTokenData).toEqual(idTokenData);
  });

  it('should replace the userId if the user is super admin and has a header for view company id', async () => {
    const idTokenData = { userId: '123', email: 'test@gmail.com', superAdminId: '123' };

    vi.mocked(verifyIdToken).mockResolvedValueOnce(idTokenData);

    const event = {
      headers: {
        [X_HEADERS.ProxyUserId]: '456',
      },
    } as unknown as AuthenticatedAPIGatewayEventType;

    await middleware({
      ...dummyRequestData,
      event,
    });

    expect(event.idTokenData).toEqual({ ...idTokenData, userId: '456' });
  });
});
