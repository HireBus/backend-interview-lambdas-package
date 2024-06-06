import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('Please enter a valid email address.')
  .trim()
  .toLowerCase();

export const fileSchema = z.object({
  content: z.instanceof(Buffer),
});

export const permissionsSchema = z.object({
  can_view_behavioral_questions_chart: z.boolean(),
  can_view_benchmark_scores: z.boolean(),
  can_view_coaching_report: z.boolean(),
  can_view_comparison_report: z.boolean(),
  can_view_conflict_tool: z.boolean(),
  can_view_hiring_pipeline: z.boolean(),
  can_view_changes_over_time_report: z.boolean(),
  can_view_interview_questions: z.boolean(),
});

export type Permissions = z.infer<typeof permissionsSchema>;
