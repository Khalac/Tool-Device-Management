import { useRef } from 'react'
import { Input, Label, Button } from '@/components/ui'
import { File, Image, Paperclip, X } from 'lucide-react'

interface BillAttachmentsSectionProps {
  selectedFiles: {
    fileAttachmentBill?: File
    imageUploadBill?: File
  }
  onFileUpload: (field: 'fileAttachmentBill' | 'imageUploadBill', file: File | null) => void
  onRemoveFile: (field: 'fileAttachmentBill' | 'imageUploadBill') => void
}

export const BillAttachmentsSection = ({ selectedFiles, onFileUpload, onRemoveFile }: BillAttachmentsSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleRemoveFile = (field: 'fileAttachmentBill' | 'imageUploadBill') => {
    onRemoveFile(field)

    if (field === 'fileAttachmentBill' && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (field === 'imageUploadBill' && imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  return (
    <div className='border-t pt-6'>
      <h3 className='mb-4 flex items-center gap-2 text-base font-semibold'>
        <Paperclip className='h-5 w-5' />
        Attachments
      </h3>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label className='flex items-center gap-2'>
            <File className='h-4 w-4' />
            File Attachment
          </Label>
          <div className='flex items-center gap-2'>
            <Input
              type='file'
              ref={fileInputRef}
              onChange={(e) => onFileUpload('fileAttachmentBill', e.target.files?.[0] || null)}
              className='flex-1 cursor-pointer text-sm'
              accept='.pdf,.doc,.docx,.txt'
            />
            {selectedFiles.fileAttachmentBill && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => handleRemoveFile('fileAttachmentBill')}
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
          {selectedFiles.fileAttachmentBill && (
            <p className='truncate text-sm text-green-600'>Selected: {selectedFiles.fileAttachmentBill.name}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label className='flex items-center gap-2'>
            <Image className='h-4 w-4' />
            Image Upload
          </Label>
          <div className='flex items-center gap-2'>
            <Input
              type='file'
              ref={imageInputRef}
              onChange={(e) => onFileUpload('imageUploadBill', e.target.files?.[0] || null)}
              className='flex-1 cursor-pointer text-sm'
              accept='image/*'
            />
            {selectedFiles.imageUploadBill && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => handleRemoveFile('imageUploadBill')}
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
          {selectedFiles.imageUploadBill && (
            <p className='truncate text-sm text-green-600'>Selected: {selectedFiles.imageUploadBill.name}</p>
          )}
        </div>
      </div>
    </div>
  )
}
