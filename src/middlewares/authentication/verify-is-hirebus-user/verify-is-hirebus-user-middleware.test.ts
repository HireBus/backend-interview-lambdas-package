import { UnauthorizedError } from '@core/services/errors';
import * as FetchUserModule from '@core/services/users/fetch-user';
import { type User } from '@core/types/user';
import { type AuthenticatedAPIGatewayEventType } from 'middlewares/authentication/types-for-authentication';
import { describe, expect, it, vi } from 'vitest';
import { verifyIsHirebusUserMiddleware } from './verify-is-hirebus-user-middleware';

describe('verifyIsHirebusUserMiddleware', () => {
  const dbClient = expect.anything();

  const before = verifyIsHirebusUserMiddleware.before as unknown as ({
    event,
  }: {
    event: AuthenticatedAPIGatewayEventType;
  }) => Promise<void>;

  vi.spyOn(FetchUserModule, 'fetchUser').mockImplementation(async () => undefined);

  it('should reject as Unauthorized if no idTokenData', async () => {
    const event = {} as AuthenticatedAPIGatewayEventType;

    await expect(before({ event })).rejects.toThrow(new UnauthorizedError('No idTokenData found'));
  });

  it('should reject as Unauthorized if no userId', async () => {
    const event = {
      idTokenData: {},
    } as AuthenticatedAPIGatewayEventType;

    await expect(before({ event })).rejects.toThrow(new UnauthorizedError('No userId found'));
  });

  it('should reject as Unauthorized if the userId is not a number', async () => {
    const event = {
      idTokenData: {
        userId: 'not-a-number',
      },
    } as AuthenticatedAPIGatewayEventType;

    await expect(before({ event })).rejects.toThrow(
      new UnauthorizedError('The userId provided via auth is not a number')
    );
  });

  it('should reject as Unauthorized if the userId does not match a user in the database', async () => {
    vi.spyOn(FetchUserModule, 'fetchUser').mockResolvedValue({
      id: 54,
    } as User);

    const event = {
      idTokenData: {
        userId: '55',
      },
      dbClient,
    } as AuthenticatedAPIGatewayEventType;

    await expect(before({ event })).rejects.toThrow(
      new UnauthorizedError('Not a known HireBus user')
    );
  });

  it('should not reject if given a valid userId', async () => {
    vi.spyOn(FetchUserModule, 'fetchUser').mockResolvedValue({
      id: 1,
    } as User);

    const event = {
      idTokenData: {
        userId: '1',
      },
      dbClient,
    } as AuthenticatedAPIGatewayEventType;

    await expect(before({ event })).resolves.toBeUndefined();
  });
});
