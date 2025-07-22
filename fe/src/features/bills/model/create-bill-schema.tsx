import { z } from 'zod'

const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const createBillSchema = z.object({
  buyerName: z
    .string({ required_error: 'Full name is required' })
    .min(5, 'Full name must be at least 5 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠăáâãèéêìíòóôõùúăđĩũơưĂÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠĂáâãèéêìíòóôõùúăđĩũơư\s]+$/,
      'Full name can only contain letters and spaces'
    )
    .transform((val) => capitalizeWords(val.trim())),

  buyerPhone: z
    .string({ required_error: 'Phone number is required' })
    .regex(/^0[0-9]{9}$/, 'Phone number must start with 0 and be exactly 10 digits')
    .transform((val) => val.trim()),

  buyerEmail: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters')
    .transform((val) => val.trim().toLowerCase()),

  buyerAddress: z
    .string({ required_error: 'Address is required' })
    .min(10, 'Address must be at least 10 characters')
    .max(100, 'Address must not exceed 100 characters')
    .regex(
      /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠăáâãèéêìíòóôõùúăđĩũơưĂÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠĂáâãèéêìíòóôõùúăđĩũơư\s,.\-/]+$/,
      'Address must not contain special characters like @, #, %, ^'
    )
    .transform((val) => val.trim()),

  assetId: z
    .array(z.string({ required_error: 'Asset ID is required' }))
    .min(1, 'Please select at least one asset')
    .max(100, 'You cannot select more than 100 assets at once'),

  description: z
    .string({ required_error: 'Description is required' })
    .min(5, 'Description must be at least 5 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .transform((val) => val.trim()),

  statusBill: z.enum(['Unpaid', 'Paid'], {
    required_error: 'Please select the payment status',
  }),

  fileAttachmentBill: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 10 * 1024 * 1024, 'File size must not exceed 10MB')
    .refine(
      (file) =>
        !file ||
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ].includes(file.type),
      'File must be in PDF, DOC, DOCX, or TXT format'
    ),

  imageUploadBill: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'Image size must not exceed 5MB')
    .refine((file) => !file || file.type.startsWith('image/'), 'File must be an image')
    .refine(
      (file) => !file || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'Image must be in JPEG, PNG, WebP, or GIF format'
    ),
})

export type CreateBillFormType = z.infer<typeof createBillSchema>
