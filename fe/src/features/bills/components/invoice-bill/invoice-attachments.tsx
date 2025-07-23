import { Paperclip, Image as ImageIcon, FileText } from 'lucide-react'
import type { BillType } from '../../model/bill-types'

interface InvoiceAttachmentsProps {
  bill: BillType
  onOpenFile?: (url: string, type: 'file' | 'image') => void
  className?: string
  isCompact?: boolean
}

export const InvoiceAttachments = ({
  bill,
  onOpenFile,
  className = '',
  isCompact = false,
}: InvoiceAttachmentsProps) => {
  const hasFileAttachment = () => {
    return bill.fileAttachmentBill && bill.fileAttachmentBill.trim() !== '' && bill.fileAttachmentBill !== 'null'
  }

  const hasImageUpload = () => {
    return bill.imageUploadBill && bill.imageUploadBill.trim() !== '' && bill.imageUploadBill !== 'null'
  }

  if (!hasFileAttachment() && !hasImageUpload()) {
    return null
  }

  const handleFileClick = (url: string, type: 'file' | 'image') => {
    if (onOpenFile) {
      onOpenFile(url, type)
    } else {
      if (url && url !== 'null') {
        try {
          window.open(url, '_blank')
        } catch (error) {
          console.error(`Failed to open ${type}:`, error)
        }
      }
    }
  }

  const textSize = isCompact ? 'text-xs' : 'text-sm max-[430px]:text-xs'
  const iconSize = isCompact ? 'h-4 w-4' : 'h-5 w-5 max-[430px]:h-4 max-[430px]:w-4'
  const padding = isCompact ? 'p-2' : 'p-2 max-[430px]:p-1'

  return (
    <div
      className={`rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${padding} ${className}`}
    >
      <div className={`flex ${isCompact ? 'flex-col gap-y-[2px]' : 'flex-wrap items-center gap-6 max-[430px]:gap-3'}`}>
        <h3 className={`flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 ${textSize}`}>
          <Paperclip className={iconSize} />
          Attachments
        </h3>

        {hasFileAttachment() && (
          <div className={`flex items-center ${isCompact ? 'gap-3' : 'gap-2 max-[430px]:gap-1'}`}>
            <FileText
              className={`text-gray-500 ${isCompact ? 'h-4 w-4' : 'h-4 w-4 max-[430px]:h-3 max-[430px]:w-3'}`}
            />
            {isCompact ? (
              <a
                href={bill.fileAttachmentBill!}
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs break-all text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400'
              >
                File: {bill.fileAttachmentBill}
              </a>
            ) : (
              <button
                onClick={() => handleFileClick(bill.fileAttachmentBill!, 'file')}
                className={`font-semibold text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 ${textSize}`}
              >
                View Document
              </button>
            )}
          </div>
        )}

        {hasImageUpload() && (
          <div className={`flex items-center ${isCompact ? 'gap-3' : 'gap-2 max-[430px]:gap-1'}`}>
            <ImageIcon
              className={`text-gray-500 ${isCompact ? 'h-4 w-4' : 'h-4 w-4 max-[430px]:h-3 max-[430px]:w-3'}`}
            />
            {isCompact ? (
              <a
                href={bill.imageUploadBill!}
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs break-all text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400'
              >
                Image: {bill.imageUploadBill}
              </a>
            ) : (
              <button
                onClick={() => handleFileClick(bill.imageUploadBill!, 'image')}
                className={`font-semibold text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 ${textSize}`}
              >
                View Image
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
