import { z } from 'zod'

export const createAssetFormSchema = z
  .object({
    assetName: z.string({ required_error: 'Asset name is required' }),
    purchaseDate: z.date({ required_error: 'Purchase date is required' }),
    cost: z.coerce.number({
      required_error: 'Cost is required',
    }),
    warrantExpiry: z.date({ required_error: 'Warrant expiry date is required' }),
    serialNumber: z.string({ required_error: 'Serial number is required' }),
    categoryId: z.string({ required_error: 'Category is required' }),
    departmentId: z.string({ required_error: 'Department is required' }),
    status: z.string({ required_error: 'Status is required' }).optional(),
    file: z
      .union([
        z
          .instanceof(File, { message: 'Image is required' })
          .refine((file) => !file || file.size !== 0 || file.size <= 5000000, `Max image size is ${5000000}MB`),
        z.string(),
      ])

      .refine((value) => value instanceof File || typeof value === 'string', {
        message: 'File is required',
      }),
    image: z
      .union([
        z
          .instanceof(File, { message: 'Image is required' })
          .refine((file) => !file || file.size !== 0 || file.size <= 5000000, `Max image size is ${5000000}MB`)
          .refine(
            (file) =>
              !file || file.type === '' || ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type),
            'Only .jpg, .jpeg, and .png formats are supported'
          ),
        z.string(),
      ])

      .refine((value) => value instanceof File || typeof value === 'string', {
        message: 'Image is required',
      }),
  })
  .superRefine(
    (
      {
        purchaseDate,
        warrantExpiry,
      }: {
        purchaseDate: Date
        warrantExpiry: Date
      },
      ctx
    ) => {
      if (warrantExpiry.getTime() < purchaseDate.getTime()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Warrant expiry date must be after purchase date',
          path: ['warrantExpiry'],
        })
      }
    }
  )

export type CreateAssetFormType = z.infer<typeof createAssetFormSchema>
