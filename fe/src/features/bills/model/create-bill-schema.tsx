import { z } from 'zod'

export const createBillSchema = z.object({
  buyerName: z.string({ required_error: 'Buyer name is required' }).min(1, 'Buyer name is required'),
  buyerPhone: z.string({ required_error: 'Buyer phone is required' }).min(1, 'Buyer phone is required'),
  buyerEmail: z.string({ required_error: 'Buyer email is required' }).email('Invalid email format'),
  buyerAddress: z.string({ required_error: 'Buyer address is required' }).min(1, 'Buyer address is required'),
  assetId: z
    .array(z.string({ required_error: 'At least one asset is required' }))
    .min(1, 'At least one asset is required'),
  description: z.string({ required_error: 'Description is required' }).min(1, 'Description is required'),
  statusBill: z.enum(['Unpaid', 'Paid']),
  fileAttachmentBill: z.instanceof(File).optional().or(z.literal('')),
  imageUploadBill: z.instanceof(File).optional().or(z.literal('')),
})

export type CreateBillFormType = z.infer<typeof createBillSchema>
