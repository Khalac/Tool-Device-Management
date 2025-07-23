import { BillQR } from '../bill-qr'
import type { BillType } from '../../model/bill-types'

interface InvoiceHeaderProps {
  bill: BillType
  formatDate: (dateString: string) => string
  showQR?: boolean
  className?: string
}

export const InvoiceHeader = ({ bill, formatDate, showQR = true, className = '' }: InvoiceHeaderProps) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <div className='flex flex-col gap-4 max-[500px]:gap-3 max-[430px]:gap-2 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex-shrink-0 max-[600px]:flex max-[600px]:justify-center'>
          <img
            src='https://www.s3corp.com.vn/images/S3CORP.svg?w=128&q=75'
            alt='Company Logo'
            className='h-14 w-auto object-contain max-[600px]:h-10 max-[430px]:h-8'
          />
        </div>

        <div className='flex flex-1 flex-col items-center justify-center text-center'>
          <div className='bg-red-500 px-4 py-2 text-lg font-bold text-white max-[600px]:px-3 max-[600px]:py-1.5 max-[600px]:text-base max-[430px]:px-2 max-[430px]:py-1 max-[430px]:text-sm'>
            SALES INVOICE
          </div>
          <p className='mt-1 text-sm text-gray-700 max-[600px]:text-xs max-[430px]:text-xs dark:text-gray-300'>
            Date: <span className='font-semibold'>{formatDate(bill.createAt)}</span>
          </p>
        </div>

        <div className='flex items-start gap-4 max-[600px]:flex-col max-[600px]:items-center max-[600px]:gap-2 max-[430px]:gap-2'>
          <div className='flex flex-col items-end justify-between gap-1 max-[600px]:items-center max-[430px]:gap-0'>
            <p className='text-sm text-gray-600 max-[600px]:text-center max-[600px]:text-xs max-[430px]:text-xs dark:text-gray-100'>
              Form No.: <span className='font-semibold'>2C24TTU</span>
            </p>
            <p className='text-sm text-gray-600 max-[600px]:text-center max-[600px]:text-xs max-[430px]:text-xs dark:text-gray-100'>
              Invoice No.: <span className='font-semibold'>{bill.billNumber}</span>
            </p>
          </div>

          {showQR && (
            <div className='max-[600px]:flex max-[600px]:justify-center'>
              <BillQR bill={bill} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
