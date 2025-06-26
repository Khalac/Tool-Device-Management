import { z } from 'zod'

export const updateInformationFormSchema = z.object({
  firstName: z.string({ required_error: 'First name is required' }).min(1, 'First name is required'),
  lastName: z.string({ required_error: 'Last name is required' }).min(1, 'Last name is required'),
  image: z.instanceof(File).optional(),
})
console.log('🚀 ~ image:', updateInformationFormSchema)

export type UpdateInformationFormType = z.infer<typeof updateInformationFormSchema>
