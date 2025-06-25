import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage, Button, Input } from '@/components/ui'
import { Camera, Upload } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { ProfileFormType } from '../../model/profile-form'

interface AvatarUploadProps {
  form: UseFormReturn<ProfileFormType>
  currentAvatar?: string
  userInitials: string
}

export const AvatarUpload = ({ form, currentAvatar, userInitials }: AvatarUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        form.setError('image', { message: 'Please select an image file' })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        form.setError('image', { message: 'File size must be less than 5MB' })
        return
      }

      form.setValue('image', file)
      form.clearErrors('image')
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const avatarSrc = previewUrl || currentAvatar

  return (
    <div className='flex flex-col items-center space-y-4'>
      <div className='relative'>
        <Avatar className='h-24 w-24'>
          <AvatarImage
            src={avatarSrc}
            alt='User avatar'
          />
          <AvatarFallback className='text-lg'>{userInitials}</AvatarFallback>
        </Avatar>

        <Button
          type='button'
          size='sm'
          variant='outline'
          className='absolute -right-2 -bottom-2 h-8 w-8 rounded-full p-0'
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          <Camera className='h-4 w-4' />
        </Button>
      </div>

      <Input
        id='avatar-upload'
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleAvatarChange}
      />

      <div className='text-center'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          <Upload className='mr-2 h-4 w-4' />
          Change Avatar
        </Button>
        <p className='text-muted-foreground mt-1 text-xs'>JPG, PNG up to 5MB</p>
      </div>
    </div>
  )
}
