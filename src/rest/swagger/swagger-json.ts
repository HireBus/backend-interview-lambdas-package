import { createApiHandler } from 'utils/api-handler/create-api-handler';
import { commonHeaders } from 'utils/http';
import swaggerJson from './swagger.json';

export function makeSwaggerJsonApiHandler() {
  return createApiHandler({
    schema: {},
    // TODO: Remove this after the `makeAPIResponse` is being refactor to accept headers
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handler: () => ({
      statusCode: 200,
      headers: commonHeaders,
      body: JSON.stringify(swaggerJson),
    }),
    type: 'public',
  });
}

export const apiHandler = makeSwaggerJsonApiHandler();
