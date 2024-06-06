import { vi } from 'vitest';

export function mockAuthenticationMiddlewares(): void {
  vi.mock('middlewares/authentication/verify-id-token/verify-id-token', () => ({
    verifyIdToken: vi.fn(() => ({
      userId: '1',
    })),
  }));

  vi.mock(
    'middlewares/authentication/verify-is-hirebus-user/verify-is-hirebus-user-middleware',
    () => ({
      verifyIsHirebusUserMiddleware: {
        before: vi.fn(),
      },
    })
  );
}
