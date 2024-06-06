import { describe, it, afterEach, expect } from 'vitest';
import { getCorsAllowedOrigin } from './get-cors-allowed-origin';

describe(getCorsAllowedOrigin.name, () => {
  const originalDBHost = process.env.DB_HOST;

  afterEach(() => {
    process.env.DB_HOST = originalDBHost;
  });

  it('should return * for test', () => {
    process.env.DB_HOST = 'test';
    expect(getCorsAllowedOrigin()).toEqual('*');
  });

  it('should return * for dev', () => {
    process.env.DB_HOST = 'dev';
  });

  // NOTE: WE NEED TO ADD MORE FOR STAGING AND PROD
});
