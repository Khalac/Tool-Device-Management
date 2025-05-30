import { httpRequest } from '@/utils'
export const getAllUsersOfDepartment = async (id: string) => {
  return await httpRequest.get(`/user/department/${id}`)
}
