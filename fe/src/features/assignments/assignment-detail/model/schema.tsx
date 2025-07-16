import { z } from 'zod'

export const updateAssignmentSchema = z.object({
  departmentId: z.string().optional(),
  userId: z.string({ required_error: 'Please select a user to assign' }),
})

export type UpdateAssignmentForm = z.infer<typeof updateAssignmentSchema>
