import * as EnvModule from '@core/constants/environment';
import { UnauthorizedError } from '@core/services/errors';
import { type MappedError } from 'utils/process-error';
import { describe, expect, it, vi } from 'vitest';
import {
  allowedWebsiteOrigins,
  isUserNotLoggedInOnWebsiteError,
} from './is-not-logged-in-profile-request-error';

describe(isUserNotLoggedInOnWebsiteError.name, () => {
  const notLoggedInProfileRequestError: MappedError = {
    routeKey: 'GET /users/profile',
    requestOrigin: 'https://dev.hirebus.com',
    body: 'Incorrect username or password',
    responseType: {
      message: 'Unauthorized',
      statusCode: 401,
      code: 8,
    },
    originalError: new Error('UnauthorizedError: Error verifying token'),
  };

  it('should return true if the error is a not logged in profile request error', () => {
    const result = isUserNotLoggedInOnWebsiteError(notLoggedInProfileRequestError);

    expect(result).toBe(true);
  });

  it.each(
    allowedWebsiteOrigins.map(origin => ({
      origin,
    }))
  )('should return true for origin $origin', ({ origin }) => {
    const result = isUserNotLoggedInOnWebsiteError({
      ...notLoggedInProfileRequestError,
      requestOrigin: origin,
    });

    expect(result).toBe(true);
  });

  it.each`
    origin
    ${'https://other-website.com'}
    ${'https://bob.com'}
  `('should return false for $origin', origin => {
    const result = isUserNotLoggedInOnWebsiteError({
      ...notLoggedInProfileRequestError,
      requestOrigin: origin,
    });

    expect(result).toBe(false);
  });

  it('should allow localhost if db_host is localhost', () => {
    vi.spyOn(EnvModule, 'ENV', 'get').mockReturnValueOnce({
      DB_HOST: 'localhost',
    } as typeof EnvModule.ENV);

    const result = isUserNotLoggedInOnWebsiteError({
      ...notLoggedInProfileRequestError,
      requestOrigin: 'http://localhost:3000',
    });

    expect(result).toBe(true);
  });

  it('should not allow localhost if db_host is not localhost', () => {
    vi.spyOn(EnvModule, 'ENV', 'get').mockReturnValueOnce({
      DB_HOST: 'not-localhost',
    } as typeof EnvModule.ENV);

    const result = isUserNotLoggedInOnWebsiteError({
      ...notLoggedInProfileRequestError,
      requestOrigin: 'http://localhost:3000',
    });

    expect(result).toBe(false);
  });

  it('should return false if there is a user id', () => {
    const error = {
      ...notLoggedInProfileRequestError,
      userId: 'user-id',
    };

    const result = isUserNotLoggedInOnWebsiteError(error);

    expect(result).toBe(false);
  });

  it('should return false if there is a user email', () => {
    const error = {
      ...notLoggedInProfileRequestError,
      userEmail: 'user-email',
    };

    const result = isUserNotLoggedInOnWebsiteError(error);

    expect(result).toBe(false);
  });

  it('should return false if the body is different', () => {
    const error = {
      ...notLoggedInProfileRequestError,
      body: 'Other error',
    };

    const result = isUserNotLoggedInOnWebsiteError(error);

    expect(result).toBe(false);
  });

  it('should return false if the responseType is different', () => {
    const error = {
      ...notLoggedInProfileRequestError,
      responseType: {
        message: 'Server Error',
        statusCode: 500,
        code: 0,
      },
    } as MappedError;

    const result = isUserNotLoggedInOnWebsiteError(error);

    expect(result).toBe(false);
  });

  it('should return true for a specific error that production needs to not send to slack', () => {
    const error: MappedError = {
      routeKey: 'GET /role-names/list',
      requestOrigin: 'https://app.hirebus.com',
      body: 'Incorrect username or password',
      responseType: {
        message: 'Unauthorized',
        statusCode: 401,
        code: 8,
      },
      originalError: new UnauthorizedError('Error verifying token'),
    };

    const result = isUserNotLoggedInOnWebsiteError(error);

    expect(result).toBe(true);
  });
});
