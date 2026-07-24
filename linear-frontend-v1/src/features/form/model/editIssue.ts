import { z } from 'zod'

export const editIssueSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be 255 characters or less'),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .or(z.literal('')),
  projectId: z.string().min(1, 'Project is required'),
  priority: z.string().min(1, 'Priority is required'),
  assigneeId: z.string().optional().or(z.literal('')),
  status: z.string().min(1, 'Status is required'),
})

export type EditIssueFormData = z.infer<typeof editIssueSchema>
