import * as errorsModule from '@core/services/errors';
import { ForbiddenError } from '@core/services/errors/forbidden-error';
import { ValidationError } from '@core/types/errors';
import { HTTP_RESPONSES } from 'constants/http';
import { describe, expect, it, vi } from 'vitest';
import { ZodError, z } from 'zod';
import { processError } from './process-error';

describe('processError', () => {
  it('should return formatted validation error with right responseType', () => {
    const result = processError(new ValidationError('my error'));
    expect(result).toStrictEqual({
      body: { issues: [{ code: 'custom', message: 'my error', path: [] }] },
      responseType: HTTP_RESPONSES.BadRequest,
    });
  });

  it('should return Zod error with right responseType', () => {
    const validationResult = z
      .object({
        name: z.string().nonempty(),
      })
      .safeParse({});
    const error = validationResult.success ? new Error() : validationResult.error;
    const result = processError(error);
    expect(result).toStrictEqual({
      body: error,
      responseType: HTTP_RESPONSES.BadRequest,
    });
  });

  it('should return UnauthorizedError with right responseType', () => {
    const error = new errorsModule.UnauthorizedError('error');
    const result = processError(error);
    expect(result).toStrictEqual({
      body: 'Incorrect username or password',
      responseType: HTTP_RESPONSES.Unauthorized,
      originalError: error,
    });
  });

  it('should return unhandled server error with details and right responseType', () => {
    const error = new Error('my error');
    const errorCopy = {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
    const copyErrorPropertiesSpy = vi
      .spyOn(errorsModule, 'copyErrorProperties')
      .mockReturnValue(errorCopy);

    const result = processError(error);

    expect(result).toStrictEqual(
      expect.objectContaining({
        body: { message: error.message, stack: error.stack, name: error.name },
        responseType: HTTP_RESPONSES.ServerError,
      })
    );
    expect(result.originalError).toBe(error);
    expect(copyErrorPropertiesSpy).toHaveBeenCalledWith(error);
  });

  const errorTypes = [
    ValidationError,
    Error,
    ZodError,
    errorsModule.UnauthorizedError,
    ForbiddenError,
  ] as const;

  const errorTypeTestCaseValues = errorTypes.map(errorType => ({
    ErrorType: errorType.name,
    ErrorConstructor: errorType as unknown as Error,
  }));

  it.each(errorTypeTestCaseValues)(
    'should include the request body in the the result for $ErrorType',
    ({ ErrorConstructor }) => {
      const error = makeError(ErrorConstructor, 'my error');
      const requestBody = { foo: 'bar' };

      const event = {
        body: requestBody,
      };

      const result = processError(error, event);
      expect(result.requestBody).toEqual(requestBody);
    }
  );

  it.each(errorTypeTestCaseValues)(
    'should include id and email of the requesting user',
    async ({ ErrorConstructor }) => {
      const idTokenData = {
        email: 'someEmail@email.com',
        userId: '53',
      };

      const requestBody = {
        data: 'some data',
      };

      const error = makeError(ErrorConstructor, 'my error');

      const event = {
        idTokenData,
        body: requestBody,
      };

      const result = processError(error, event);

      // it should include userEmail and userId in the mapped error
      expect(result.requestBody).toEqual(event.body);
      expect(result.userId).toEqual(idTokenData.userId);
      expect(result.userEmail).toEqual(idTokenData.email);
    }
  );

  it.each(errorTypeTestCaseValues)(
    'should include the route key in the the result for $ErrorType',
    ({ ErrorConstructor }) => {
      const error = makeError(ErrorConstructor, 'my error');
      const event = {
        routeKey: 'GET /some/path',
      };

      const result = processError(error, event);
      expect(result.routeKey).toEqual(event.routeKey);
    }
  );

  it.each(errorTypeTestCaseValues)(
    'should include requestOrigin in the result for $ErrorType',
    ({ ErrorConstructor }) => {
      const event = {
        headers: {
          origin: 'https://some-origin.com',
        },
      };

      const error = makeError(ErrorConstructor, 'my error');

      const result = processError(error, event);

      expect(result.requestOrigin).toEqual(event.headers.origin);
    }
  );

  it.each(errorTypeTestCaseValues)(
    'should include pathname in the result for $ErrorType',
    ({ ErrorConstructor }) => {
      const pathname = '/some/path';

      const event = {
        headers: {
          pathname,
        },
      };

      const error = makeError(ErrorConstructor, 'my error');

      const result = processError(error, event);

      expect(result.pathname).toEqual(event.headers.pathname);
    }
  );

  it.each(errorTypeTestCaseValues)(
    'should include queryStringParameters in the result for $ErrorType',
    ({ ErrorConstructor }) => {
      const queryStringParameters = {
        foo: 'bar',
      };

      const event = {
        queryStringParameters,
      };

      const error = makeError(ErrorConstructor, 'my error');

      const result = processError(error, event);

      expect(result.queryStringParameters).toEqual(event.queryStringParameters);
    }
  );
});

function makeError(ErrorConstructor: Error, message: string): Error {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new (ErrorConstructor as CallableFunction)(message) as unknown as Error;
}
