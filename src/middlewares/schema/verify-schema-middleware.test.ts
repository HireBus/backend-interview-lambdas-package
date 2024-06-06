import * as kyselyClientPoolModule from '@core/db/utils/kysely-client-pool';
import { type APIGatewayProxyEventV2 } from 'aws-lambda';
import * as addRequestInfoModule from 'utils/api-handler/add-request-info-to-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { verifySchemaMiddleware } from './verify-schema-middleware';

describe(verifySchemaMiddleware.name, () => {
  const addRequestInfoToEventSpy = vi.spyOn(addRequestInfoModule, 'addRequestInfoToEvent');
  const destroyAllKyselyDbConnectionsSpy = vi.spyOn(
    kyselyClientPoolModule,
    'destroyAllKyselyDbConnections'
  );
  const schema = {
    body: z.object({ name: z.string() }),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('validates event against the schema successfully', async () => {
    const event = { body: { name: 'Test' } } as unknown as APIGatewayProxyEventV2;
    await verifySchemaMiddleware(schema).before?.({ event });

    expect(addRequestInfoToEventSpy).toHaveBeenCalled();
    expect(destroyAllKyselyDbConnectionsSpy).not.toHaveBeenCalled();
  });

  it('throws an error and destroys DB connections if validation fails', async () => {
    const event = {} as unknown as APIGatewayProxyEventV2;
    await expect(() => verifySchemaMiddleware(schema).before?.({ event })).rejects.toThrow();

    expect(addRequestInfoToEventSpy).not.toHaveBeenCalled();
    expect(destroyAllKyselyDbConnectionsSpy).toHaveBeenCalled();
  });
});
