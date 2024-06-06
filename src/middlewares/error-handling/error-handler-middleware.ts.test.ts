import * as kysely from '@core/db/utils/kysely-client-pool';
import { type Request } from '@middy/core';
import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_RESPONSES } from 'constants/http';
import { errorHandlerMiddleware } from 'middlewares/error-handling/error-handler-middleware';
import * as logErrorModule from 'middlewares/error-handling/log-error';
import { commonHeaders } from 'utils/http';
import * as processErrorModule from 'utils/process-error';
import { type MappedError } from 'utils/process-error';
import { describe, expect, it, vi } from 'vitest';
import * as LogErrorToSlackModule from './slack/log-error-to-slack';

describe('errorHandlerMiddleware.onError event', () => {
  const getWorkingRequest = () =>
    ({
      response: { body: 'apples', statusCode: 100 },
      error: null,
    } as Request<APIGatewayProxyEvent, APIGatewayProxyResult>);

  const executeOnErrorHandler = async (
    request: Request<APIGatewayProxyEvent, APIGatewayProxyResult>
  ) => {
    const mappedError: MappedError = {
      body: 'body',
      responseType: HTTP_RESPONSES.ServerError,
      originalError: new Error('original error'),
    };
    const processErrorSpy = vi
      .spyOn(processErrorModule, 'processError')
      .mockReturnValue(mappedError);

    await errorHandlerMiddleware.onError!(request);
    return {
      processErrorSpy,
      mappedError,
    };
  };

  it('should not do anything if no error', async () => {
    const { processErrorSpy } = await executeOnErrorHandler(getWorkingRequest());
    expect(processErrorSpy).not.toHaveBeenCalled();
  });

  it('should process error properly', async () => {
    const destroyAllKyselyDbConnectionsSpy = vi
      .spyOn(kysely, 'destroyAllKyselyDbConnections')
      .mockImplementation(() => Promise.resolve());
    const logErrorSpy = vi.spyOn(logErrorModule, 'logError').mockImplementation(() => {});

    const request = { ...getWorkingRequest(), error: new Error('error') };
    const { processErrorSpy, mappedError } = await executeOnErrorHandler(request);

    expect(processErrorSpy).toHaveBeenCalledWith(request.error, request.event?.body);
    expect(logErrorSpy).toHaveBeenCalledWith(mappedError);
    expect(destroyAllKyselyDbConnectionsSpy).toHaveBeenCalled();
    expect(request.response).toStrictEqual({
      headers: commonHeaders,
      statusCode: mappedError.responseType.statusCode,
      body: JSON.stringify(mappedError.body),
    });
  });

  it('should send error to slack channel', async () => {
    const logErrorToSlackSpy = vi
      .spyOn(LogErrorToSlackModule, 'logErrorToSlack')
      .mockImplementation(async () => {});

    const request = { ...getWorkingRequest(), error: new Error('error') };
    const { mappedError } = await executeOnErrorHandler(request);

    expect(logErrorToSlackSpy).toHaveBeenCalledWith(mappedError);
  });

  it('should pass request event to processError', async () => {
    const processErrorSpy = vi
      .spyOn(processErrorModule, 'processError')
      .mockReturnValue({ body: 'body', responseType: HTTP_RESPONSES.ServerError });

    const mockEvent = {
      body: 'body',
      idTokenData: {
        userId: 'userId',
        email: 'email',
      },
    };

    const request = {
      ...getWorkingRequest(),
      error: new Error('error'),
      event: mockEvent,
    } as unknown as ReturnType<typeof getWorkingRequest>;

    await errorHandlerMiddleware.onError!(request);

    expect(processErrorSpy).toHaveBeenCalledWith(request.error, request.event);
  });
});
