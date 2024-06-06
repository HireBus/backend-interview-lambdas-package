import { describe, expect, it } from 'vitest';
import { createBulkUserEventsApiSchema } from './schema';

describe('createBulkUserEventsApiSchema', () => {
  it('should validate correct data', () => {
    const data = {
      user_events: [
        {
          user_id: 1,
          description: 'User event description',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const result = createBulkUserEventsApiSchema.body.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject data with invalid user_id', () => {
    const data = {
      user_events: [
        {
          user_id: 'not-a-number', // invalid user_id
          description: 'User event description',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const result = createBulkUserEventsApiSchema.body.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject data with missing description', () => {
    const data = {
      user_events: [
        {
          user_id: 1,
          // missing description, should fail
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const result = createBulkUserEventsApiSchema.body.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject data with invalid timestamp format', () => {
    const data = {
      user_events: [
        {
          user_id: 1,
          description: 'User event description',
          timestamp: 'not-a-date', // invalid timestamp
        },
      ],
    };

    const result = createBulkUserEventsApiSchema.body.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should work with empty array', () => {
    const data = {
      user_events: [],
    };

    const result = createBulkUserEventsApiSchema.body.safeParse(data);
    expect(result.success).toBe(true);
  });
});
