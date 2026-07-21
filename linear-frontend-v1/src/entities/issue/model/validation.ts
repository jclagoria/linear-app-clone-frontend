import { z } from 'zod/v4'

export const issueFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or fewer'),
  description: z
    .string()
    .max(50000, 'Description must be 50000 characters or fewer')
    .optional()
    .default(''),
  status: z.string().optional().default('Todo'),
  priority: z.number().min(0).max(4).optional().default(0),
  assigneeId: z.string().nullable().optional().default(null),
  projectId: z.string().nullable().optional().default(null),
  cycleId: z.string().nullable().optional().default(null),
  labels: z.array(z.string()).optional().default([]),
})

export type IssueFormSchema = z.infer<typeof issueFormSchema>

export const issueFormFieldLabels: Record<keyof IssueFormSchema, string> = {
  title: 'Title',
  description: 'Description',
  status: 'Status',
  priority: 'Priority',
  assigneeId: 'Assignee',
  projectId: 'Project',
  cycleId: 'Cycle',
  labels: 'Labels',
}
