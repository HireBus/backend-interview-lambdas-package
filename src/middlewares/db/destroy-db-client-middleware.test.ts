import { describe, expect, it, vi } from 'vitest';
import { type KyselyClient } from '@core/db/connections';
import { destroyDbClientMiddleware } from './destroy-db-client-middleware';

describe('destroyDbClientMiddleware', () => {
  it('should call destroy on the dbClient if it exists', async () => {
    const mockDestroy = vi.fn();
    const mockDbClient = {
      destroy: mockDestroy,
    } as unknown as KyselyClient;

    await destroyDbClientMiddleware.after({ dbClient: mockDbClient });

    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('should not call destroy if dbClient is null', async () => {
    const mockDestroy = vi.fn();

    await destroyDbClientMiddleware.after({ dbClient: null });

    expect(mockDestroy).not.toHaveBeenCalled();
  });

  it('should not call destroy if dbClient is undefined', async () => {
    const mockDestroy = vi.fn();

    await destroyDbClientMiddleware.after({ dbClient: undefined });

    expect(mockDestroy).not.toHaveBeenCalled();
  });

  it('should destroy both dbClients', async () => {
    const mockDbClientDestroy = vi.fn();
    const mockLegacyDbClientDestroy = vi.fn();

    const mockDbClient = {
      destroy: mockDbClientDestroy,
    } as unknown as KyselyClient;

    const mockLegacyDbClient = {
      destroy: mockLegacyDbClientDestroy,
    } as unknown as KyselyClient;

    await destroyDbClientMiddleware.after({ dbClient: mockDbClient, legacyDbClient: mockLegacyDbClient });

    expect(mockDbClientDestroy).toHaveBeenCalledTimes(1);
    expect(mockLegacyDbClientDestroy).toHaveBeenCalledTimes(1);
  });
});
