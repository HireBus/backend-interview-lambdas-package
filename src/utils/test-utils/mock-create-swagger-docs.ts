import { vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createSwaggerDocs: vi.fn(),
}));

vi.mock('utils/swagger/create-swagger-docs', () => ({
  createSwaggerDocs: mocks.createSwaggerDocs,
}));

export const mockCreateSwaggerDocs = mocks.createSwaggerDocs;
