import { httpRequest } from '@/utils'

export const createBill = async (data: FormData) => {
  return await httpRequest.post('/bills', data, {
    'Content-Type': 'multipart/form-data',
  })
}
