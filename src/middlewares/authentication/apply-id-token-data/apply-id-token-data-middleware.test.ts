import { createMockLambdaEvent } from 'utils/test-utils/create-mock-lambda-event';
import { describe, expect, it, vi } from 'vitest';
import { applyIdTokenDataMiddleware } from './apply-id-token-data-middleware';

const mocks = vi.hoisted(() => ({
  verifyAndApplyIdTokenData: vi.fn(),
}));

vi.mock('../utils/verify-and-apply-id-token-data', () => ({
  verifyAndApplyIdTokenData: mocks.verifyAndApplyIdTokenData,
}));

describe('applyIdTokenDataMiddleware', () => {
  it('should correctly call "verifyAndApplyIdTokenData"', async () => {
    const event = createMockLambdaEvent();

    await applyIdTokenDataMiddleware.before({ event });

    expect(mocks.verifyAndApplyIdTokenData).toHaveBeenCalledWith({
      event,
      requireUserId: false,
    });
  });
});
