import { httpRequest } from '@/utils'
import type { UpdateAssignmentForm } from '../assignment-detail/model'

export const UpdateAssignment = async (id: string, data: UpdateAssignmentForm) => {
  if (data.userId && !data.departmentId) {
    return await httpRequest.put(`/assignments/${id}`, {
      userId: parseInt(data.userId),
    })
  }

  if (!data.userId && data.departmentId) {
    return await httpRequest.put(`/assignments/${id}`, {
      departmentId: parseInt(data.departmentId),
    })
  }

  if (data.userId && data.departmentId) {
    return await httpRequest.put(`/assignments/${id}`, {
      userId: parseInt(data.userId),
      departmentId: parseInt(data.departmentId),
    })
  }

  // Default case
  return await httpRequest.put(`/assignments/${id}`, {
    userId: parseInt(data.userId),
  })
}
