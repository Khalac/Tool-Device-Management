import { z } from 'zod'
export const forgetPasswordFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export type ForgetPasswordFormType = z.infer<typeof forgetPasswordFormSchema>
