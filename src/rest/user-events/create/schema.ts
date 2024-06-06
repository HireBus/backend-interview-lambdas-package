import { z } from 'zod';

export const createBulkUserEventsApiSchema = {
  body: z.object({
    user_events: z.array(
      z.object({
        user_id: z.number(),
        description: z.string(),
        timestamp: z.string().datetime(),
      })
    ),
  }),
} as const;
