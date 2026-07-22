import { z } from 'zod/v4'

export const labelIdSchema = z.string().uuid('Invalid label identifier')

export const labelIdsSchema = z.array(labelIdSchema, {
  message: 'One or more selected labels are invalid',
})
