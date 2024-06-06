import * as envModule from '@core/constants/environment';
import * as commonsModule from '@core/utils/commons';
import * as sentryModule from '@core/utils/sentry/sentry-serverless';
import { HTTP_RESPONSES } from 'constants/http';
import { logError } from 'middlewares/error-handling/log-error';
import { type MappedError } from 'utils/process-error';
import { describe, expect, it, vi } from 'vitest';

describe('errorHandlerMiddleware', () => {
  const runLogError = () => {
    const spies = {
      captureExceptionSpy: vi.fn(),
      loggerSpy: vi.spyOn(commonsModule, 'logger').mockImplementation(() => {}),
    };
    vi.spyOn(sentryModule, 'sentry', 'get').mockReturnValue({
      captureException: spies.captureExceptionSpy,
    } as unknown as typeof sentryModule.sentry);

    const mappedError: MappedError = {
      body: 'body',
      responseType: HTTP_RESPONSES.ServerError,
      originalError: new Error('original error'),
    };
    logError(mappedError);

    return { ...spies, mappedError };
  };

  it('should call logger with all error information', async () => {
    const { loggerSpy, mappedError } = runLogError();
    expect(loggerSpy).toHaveBeenCalledWith({
      path: 'packages/lambdas/src/middlewares/error-handling/log-error.ts',
      event: 'errorHandlerMiddleware',
      log: mappedError,
    });
  });

  it('should not capture exception on sentry for other stages', async () => {
    vi.spyOn(envModule, 'ENV', 'get').mockReturnValue({} as unknown as typeof envModule.ENV);
    const { captureExceptionSpy } = runLogError();
    expect(captureExceptionSpy).not.toHaveBeenCalled();
  });
});
