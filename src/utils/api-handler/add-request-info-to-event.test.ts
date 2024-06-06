import { describe, it, expect } from 'vitest';
import { type APIGatewayProxyEventV2 } from 'aws-lambda';
import { type z } from 'zod';
import { addRequestInfoToEvent } from './add-request-info-to-event';

describe(addRequestInfoToEvent.name, () => {
  it('updates body when it is present in validationResult', async () => {
    const validationResult = {
      data: {
        body: 'sample body',
      },
    } as z.SafeParseSuccess<{ body: string }>;

    const event = {} as APIGatewayProxyEventV2;

    addRequestInfoToEvent(validationResult, event);

    expect(event.body).toEqual('sample body');
  });

  it('does not update body when it is not present in validationResult', async () => {
    const validationResult = {
      data: {},
    } as z.SafeParseSuccess<{ body: object }>;

    const event = {
      body: 'existing body',
    } as APIGatewayProxyEventV2;

    addRequestInfoToEvent(validationResult, event);

    expect(event.body).toEqual('existing body');
  });

  it('updates headers when they are present in validationResult', async () => {
    const validationResult = {
      data: {
        headers: {
          'x-custom-header': 'test',
        },
      },
    } as z.SafeParseSuccess<object>;

    const event = {} as APIGatewayProxyEventV2;

    addRequestInfoToEvent(validationResult, event);

    expect(event.headers).toEqual({
      'x-custom-header': 'test',
    });
  });

  it('does not update headers when they are not present in validationResult', async () => {
    const validationResult = {
      data: {},
    } as z.SafeParseSuccess<object>;

    const event = {
      headers: {
        'x-existing-header': 'existing',
      },
    } as unknown as APIGatewayProxyEventV2;

    addRequestInfoToEvent(validationResult, event);

    expect(event.headers).toEqual({
      'x-existing-header': 'existing',
    });
  });

  it('updates queryStringParameters when they are present in validationResult', async () => {
    const validationResult = {
      data: {
        queryStringParameters: {
          param: 'value',
        },
      },
    } as z.SafeParseSuccess<object>;

    const event = {} as APIGatewayProxyEventV2;

    addRequestInfoToEvent(validationResult, event);

    expect(event.queryStringParameters).toEqual({
      param: 'value',
    });
  });

  it('does not update queryStringParameters when they are not present in validationResult', async () => {
    const validationResult = {
      data: {},
    } as z.SafeParseSuccess<object>;

    const event = {
      queryStringParameters: {
        'existing-param': 'existing-value',
      },
    } as unknown as APIGatewayProxyEventV2;

    addRequestInfoToEvent(validationResult, event);

    expect(event.queryStringParameters).toEqual({
      'existing-param': 'existing-value',
    });
  });

  it('updates pathParameters when they are present in validationResult', async () => {
    const validationResult = {
      data: {
        pathParameters: {
          param: 'value',
        },
      },
    } as z.SafeParseSuccess<object>;

    const event = {} as APIGatewayProxyEventV2;

    addRequestInfoToEvent(validationResult, event);

    expect(event.pathParameters).toEqual({
      param: 'value',
    });
  });

  it('does not update pathParameters when they are not present in validationResult', async () => {
    const validationResult = {
      data: {},
    } as z.SafeParseSuccess<object>;

    const event = {
      pathParameters: {
        'existing-param': 'existing-value',
      },
    } as unknown as APIGatewayProxyEventV2;

    addRequestInfoToEvent(validationResult, event);

    expect(event.pathParameters).toEqual({
      'existing-param': 'existing-value',
    });
  });
});
