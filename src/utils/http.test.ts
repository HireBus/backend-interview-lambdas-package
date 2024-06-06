import { describe, expect, it } from 'vitest';

import { HTTP_RESPONSES } from '../constants/http';
import { commonHeaders, makeAPIResponse } from './http';

describe('makeAPIResponse', () => {
  const headers = commonHeaders;

  it('should throw error if error', () => {
    const error = new Error('test');

    expect(() =>
      makeAPIResponse({
        type: 'ServerError',
        error,
      })
    ).toThrow(error);
  });

  it('should create a response considering type and data', () => {
    const type = 'Success';
    const data = { message: 'Hello, world!' };

    const result = makeAPIResponse({
      type,
      data,
    });
    const expectedResult = {
      statusCode: HTTP_RESPONSES[type].statusCode,
      headers,
      body: JSON.stringify({
        message: HTTP_RESPONSES[type].message,
        code: HTTP_RESPONSES[type].code,
        data,
      }),
    };

    expect(result).toEqual(expectedResult);
  });

  it('should create a response considering type, data and raw', () => {
    const type = 'Success';
    const data = { message: 'Hello, world!' };
    const raw = { raw: 'raw' };

    const result = makeAPIResponse({
      type,
      data,
      raw,
    });
    const expectedResult = {
      statusCode: HTTP_RESPONSES[type].statusCode,
      headers,
      body: JSON.stringify({
        ...raw,
        message: HTTP_RESPONSES[type].message,
        code: HTTP_RESPONSES[type].code,
        data,
      }),
    };

    expect(result).toEqual(expectedResult);
  });
});
