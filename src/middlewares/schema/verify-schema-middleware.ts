import { destroyAllKyselyDbConnections } from '@core/db/utils/kysely-client-pool';
import { type APIGatewayProxyEventV2 } from 'aws-lambda';
import { addRequestInfoToEvent } from 'utils/api-handler/add-request-info-to-event';
import { z, type ZodSchema } from 'zod';

type SchemaType<TBody, THeaders, TPathParams, TQuery> = {
  body?: ZodSchema<TBody>;
  headers?: ZodSchema<THeaders>;
  pathParameters?: ZodSchema<TPathParams>;
  queryStringParameters?: ZodSchema<TQuery>;
};

export function verifySchemaMiddleware<TBody, TQuery, THeaders, TPathParams>(
  schema: SchemaType<TBody, THeaders, TPathParams, TQuery>
) {
  return {
    before: async ({ event }: { event: APIGatewayProxyEventV2 }) => {
      const validationResult = z.object(schema).safeParse(event);

      if (!validationResult.success) {
        await destroyAllKyselyDbConnections();
        throw validationResult.error;
      }

      addRequestInfoToEvent(validationResult, event);
    },
  };
}
