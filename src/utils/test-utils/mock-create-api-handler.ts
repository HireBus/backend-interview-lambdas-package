import { vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const mockApiHandler = { use: vi.fn() };
  mockApiHandler.use.mockImplementation(() => mockApiHandler);

  return {
    createApiHandler: vi.fn(() => mockApiHandler),
  };
});

vi.mock('utils/api-handler/create-api-handler', () => ({
  createApiHandler: mockCreateApiHandler,
}));

export const mockCreateApiHandler = mocks.createApiHandler;
