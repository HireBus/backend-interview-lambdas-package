import { type APIGatewayProxyEventV2 } from 'aws-lambda';
import { type z } from 'zod';

export function addRequestInfoToEvent<TBody, TQuery, THeaders, TPathParams>(
  validationResult: z.SafeParseSuccess<{
    body?: TBody;
    headers?: THeaders;
    pathParameters?: TPathParams;
    queryStringParameters?: TQuery;
  }>,
  event: APIGatewayProxyEventV2
) {
  const { body, headers, queryStringParameters, pathParameters } = validationResult.data;

  if (body) {
    event.body = body as APIGatewayProxyEventV2['body'];
  }

  if (headers) event.headers = headers as APIGatewayProxyEventV2['headers'];

  if (queryStringParameters) {
    event.queryStringParameters =
      queryStringParameters as APIGatewayProxyEventV2['queryStringParameters'];
  }

  if (pathParameters) {
    event.pathParameters = pathParameters as APIGatewayProxyEventV2['pathParameters'];
  }
}
