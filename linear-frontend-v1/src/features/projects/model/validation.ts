import { z } from 'zod'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export const createProjectSchema = z.object({
  teamId: z.string().uuid('Team is required'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be 255 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
  startDate: z
    .string()
    .regex(dateRegex, 'Invalid start date format')
    .optional()
    .or(z.literal('')),
  targetDate: z
    .string()
    .regex(dateRegex, 'Invalid target date format')
    .optional()
    .or(z.literal('')),
})

export type CreateProjectFormSchema = z.infer<typeof createProjectSchema>
