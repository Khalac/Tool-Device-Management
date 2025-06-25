import { useState } from 'react'
import { ProfileForm } from './_components/profile-form'
import type { ProfileFormType } from '../model/profile-form'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { tryCatch } from '@/utils'
import { updateInformation } from '../api'
import { toast } from 'sonner'
import { getSession } from '@/features/auth/slice'
import { useNavigate } from 'react-router-dom'

export const EditProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (data: ProfileFormType) => {
    try {
      setIsLoading(true)
      const response = await tryCatch(updateInformation(data))

      if (response.error) {
        toast.error(response.error?.message || 'Failed to update profile')
        return
      }

      toast.success('Profile updated successfully')

      dispatch(getSession())
      navigate('/dashboard')
    } catch (error) {
      toast.error('An error occurred while updating profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    navigate('/dashboard')
  }

  return (
    <div className='container mx-auto py-6'>
      <ProfileForm
        user={user}
        onSubmit={handleSubmit}
        onClose={handleClose}
        isLoading={isLoading}
      />
    </div>
  )
}

export default EditProfile
