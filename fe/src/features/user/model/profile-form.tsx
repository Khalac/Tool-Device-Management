import { z } from 'zod'

export const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  image: z.instanceof(File).optional(),
})

export type ProfileFormType = z.infer<typeof profileFormSchema>

export interface UserProfile {
  id: number
  firstName: string
  lastName: string
  email: string
  avatar?: string
  isActivate: boolean
  role: {
    id: number
    slug: string
  }
  department?: {
    id: number
    departmentName: string
  }
}
