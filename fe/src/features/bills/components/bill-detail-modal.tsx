import { Dialog, DialogContent, DialogHeader, DialogTitle, Badge } from '@/components/ui'
import { Receipt, Paperclip, Image as ImageIcon, FileText, InfoIcon } from 'lucide-react'
import type { BillType } from '../model/bill-types'
import { BillQR } from './bill-qr'

interface BillDetailModalProps {
  bill: BillType | null
  open: boolean
  onClose: () => void
  onStatusChange?: (billId: number, newStatus: 'Unpaid' | 'Paid') => void
}

export const BillDetailModal = ({ bill, open, onClose }: BillDetailModalProps) => {
  console.log('🚀 ~ BillDetailModal ~ bill:', bill)
  if (!bill) return null

  // const toggleStatus = () => {
  //   if (bill && onStatusChange) {
  //     const newStatus = bill.statusBill === 'Paid' ? 'Unpaid' : 'Paid'
  //     onStatusChange(bill.id, newStatus)
  //     toast.success(`Bill marked as ${newStatus}`)
  //   }
  // }

  const getStatusColor = (status: string) => {
    const colors = {
      Unpaid: 'bg-red-100 text-red-800 dark:bg-red-400 dark:text-red-700',
      Paid: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    } as const
    return colors[status as keyof typeof colors] || colors.Unpaid
  }

  // const formatDate = (dateString: string) => {
  //   try {
  //     if (!dateString) return 'N/A'
  //     return new Date(dateString).toLocaleDateString('en-US', {
  //       year: 'numeric',
  //       month: 'short',
  //       day: 'numeric',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     })
  //   } catch {
  //     return 'N/A'
  //   }
  // }

  const formatDateShort = (dateString: string) => {
    try {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  const getAssetName = () => {
    return bill.assets?.assetName || 'Unknown Asset'
  }

  const getCategoryName = () => {
    return bill.assets?.category?.categoryName || 'No Category'
  }

  const getAssetCost = () => {
    if (bill.assets?.cost !== undefined && bill.assets.cost !== null) {
      return bill.assets.cost
    }
    return bill.amount || 0
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose()
    }
  }

  // const getCreatorInitials = () => {
  //   const name = bill.creator?.fullName || 'Unknown User'
  //   return name
  //     .split(' ')
  //     .map((n) => n[0])
  //     .join('')
  //     .toUpperCase()
  //     .slice(0, 2)
  // }

  // const isWarrantyExpired = (warrantyDate?: string) => {
  //   if (!warrantyDate) return false
  //   return new Date(warrantyDate) < new Date()
  // }

  // const getLastUpdated = () => {
  //   if (!bill.updateAt || bill.updateAt === bill.createAt) {
  //     return bill.createAt
  //   }
  //   return bill.updateAt
  // }

  const hasFileAttachment = () => {
    return bill.fileAttachmentBill && bill.fileAttachmentBill.trim() !== '' && bill.fileAttachmentBill !== 'null'
  }
  console.log('🚀 ~ hasFileAttachment ~ hasFileAttachment:', hasFileAttachment)

  const hasImageUpload = () => {
    return bill.imageUploadBill && bill.imageUploadBill.trim() !== '' && bill.imageUploadBill !== 'null'
  }

  const openFile = (url: string, type: 'file' | 'image') => {
    if (url && url !== 'null') {
      try {
        window.open(url, '_blank')
      } catch (error) {
        console.error(`Failed to open ${type}:`, error)
      }
    }
  }

  // const InfoRow = ({
  //   label,
  //   value,
  //   valueClassName = '',
  //   badge = false,
  //   badgeClassName = '',
  // }: {
  //   label: string
  //   value: string | number
  //   valueClassName?: string
  //   badge?: boolean
  //   badgeClassName?: string
  // }) => (
  //   <div className='flex items-start gap-3 border-gray-100 py-3 last:border-b-0 dark:border-gray-700'>
  //     <div className='text-sm text-gray-700 dark:text-gray-300'>
  //       <span className='font-medium'>{label}: </span>
  //       {badge ? (
  //         <Badge
  //           className={`${badgeClassName} ml-1`}
  //           variant='outline'
  //         >
  //           {value}
  //         </Badge>
  //       ) : (
  //         <span className={`text-gray-900 dark:text-gray-100 ${valueClassName}`}>{value}</span>
  //       )}
  //     </div>
  //   </div>
  // )

  const sellerInfo = {
    companyName: 'SUNRISE SOFTWARE SOLUTIONS CORPORATION',
    taxCode: '0305089644',
    address: '307/12 Nguyen Van Troi, Ward 1, Tan Binh District, HCMC, Viet Nam',
    phoneNumber: '028-35471411',
    accountNumber: '1982738238232',
  }

  const buyerInfo = {
    name: 'Ho Bao Quoc',
    address: '533/8 Nguyen Tri Phuong, Ward 8, District 10, Ho Chi Minh City',
    phoneNumber: '032-35471411',
    // taxCode: '',
    // accountNumber: '4568239472356',
    // paymentMethod: 'Bank Transfer',
  }

  const items = [
    {
      stt: 1,
      assetName: getAssetName(),
      category: getCategoryName(),
      quantity: 1,
      unitPrice: getAssetCost(),
      amount: getAssetCost(),
    },
  ]

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      modal={true}
    >
      <DialogContent className='!h-[90vh] w-[50vw] !max-w-[1200px] overflow-y-auto bg-white max-[600px]:!w-full max-[430px]:!w-[95vw] max-[430px]:text-xs sm:w-[80vw] md:w-[70vw] lg:w-[60vw] dark:bg-gray-900'>
        <DialogHeader className='border-b pb-4 max-[430px]:pb-2 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <DialogTitle className='flex items-center gap-3 text-xl font-bold text-gray-900 max-[430px]:gap-2 max-[430px]:text-lg dark:text-gray-100'>
              <Receipt className='h-5 w-5 max-[430px]:h-4 max-[430px]:w-4' />
              SALES INVOICE - {bill.billNumber}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className='rounded-lg border border-gray-200 bg-white p-6 max-[600px]:p-3 max-[430px]:p-2 dark:border-gray-700 dark:bg-gray-800'>
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
                Date: <span className='font-semibold'>{formatDateShort(bill.createAt)}</span>
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

              <div className='max-[600px]:flex max-[600px]:justify-center'>
                <BillQR bill={bill} />
              </div>
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-4 max-[500px]:p-3 max-[430px]:p-2 dark:border-gray-700 dark:bg-gray-800'>
          <h3 className='mb-3 text-sm font-semibold text-gray-900 max-[500px]:text-xs max-[430px]:mb-2 max-[430px]:text-xs dark:text-gray-100'>
            Seller: <span className='font-normal'>{sellerInfo.companyName}</span>
          </h3>
          <div className='grid grid-cols-1 gap-2 text-sm max-[500px]:text-xs max-[430px]:gap-1 max-[430px]:text-xs'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
              Tax Code: <span className='font-normal'>{sellerInfo.taxCode}</span>
            </h3>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
              Address: <span className='font-normal'>{sellerInfo.address}</span>
            </h3>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
              Phone: <span className='font-normal'>{sellerInfo.phoneNumber}</span>
            </h3>
            <h3 className='border-b pb-2 font-semibold text-gray-900 max-[430px]:pb-1 dark:text-gray-100'>
              Account No.: <span className='font-normal'>{sellerInfo.accountNumber}</span>
            </h3>
            <h3 className='mt-0.5 text-sm font-semibold text-gray-900 max-[500px]:text-xs max-[430px]:text-xs dark:text-gray-100'>
              Buyer: <span className='font-normal'>{buyerInfo.name}</span>
            </h3>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
              Address: <span className='font-normal'>{buyerInfo.address}</span>
            </h3>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
              Phone: <span className='font-normal'>{buyerInfo.phoneNumber}</span>
            </h3>
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm max-[430px]:text-xs'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr className='border-b dark:border-gray-600'>
                  <th className='border-r px-3 py-2 text-center text-xs font-semibold text-gray-900 max-[430px]:px-1 max-[430px]:py-1 max-[430px]:text-xs dark:border-gray-600 dark:text-gray-300'>
                    No.
                  </th>
                  <th className='border-r px-3 py-2 text-center text-xs font-semibold text-gray-900 max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600 dark:text-gray-300'>
                    Asset Name
                  </th>
                  <th className='border-r px-3 py-2 text-center text-xs font-semibold text-gray-900 max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600 dark:text-gray-300'>
                    Category
                  </th>
                  <th className='border-r px-3 py-2 text-center text-xs font-semibold text-gray-900 max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600 dark:text-gray-300'>
                    Qty
                  </th>
                  <th className='border-r px-3 py-2 text-center text-xs font-semibold text-gray-900 max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600 dark:text-gray-300'>
                    Unit Price
                  </th>
                  <th className='px-3 py-2 text-center text-xs font-semibold text-gray-900 max-[430px]:px-1 max-[430px]:py-1 dark:text-gray-300'>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800'>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className='border-b dark:border-gray-600'
                  >
                    <td className='border-r px-3 py-2 text-center max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      {item.stt}
                    </td>
                    <td className='border-r px-3 py-2 text-center max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      {item.assetName}
                    </td>
                    <td className='border-r px-3 py-2 text-center max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      {item.category}
                    </td>
                    <td className='border-r px-3 py-2 text-center max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      {item.quantity}
                    </td>
                    <td className='border-r px-3 py-2 text-center max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      ${item.unitPrice.toLocaleString()}
                    </td>
                    <td className='px-3 py-2 text-center max-[430px]:px-1 max-[430px]:py-1'>
                      ${item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {[...Array(3)].map((_, index) => (
                  <tr
                    key={`empty-${index}`}
                    className='border-b dark:border-gray-600'
                  >
                    <td className='border-r px-3 py-2 text-center max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      &nbsp;
                    </td>
                    <td className='border-r px-3 py-2 max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      &nbsp;
                    </td>
                    <td className='border-r px-3 py-2 text-center max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      &nbsp;
                    </td>
                    <td className='border-r px-3 py-2 text-center max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      &nbsp;
                    </td>
                    <td className='border-r px-3 py-2 text-right max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      &nbsp;
                    </td>
                    <td className='px-3 py-2 text-right max-[430px]:px-1 max-[430px]:py-1'>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className='bg-gray-50 dark:bg-gray-700'>
                <tr className='border-b dark:border-gray-600'>
                  <td
                    colSpan={2}
                    className='px-3 py-2 text-left text-sm font-semibold text-gray-900 max-[430px]:px-1 max-[430px]:py-1 max-[430px]:text-xs dark:text-gray-300'
                  >
                    <span className='px-3 py-2 text-right max-[430px]:px-1 max-[430px]:py-1 dark:border-gray-600'>
                      Status:
                    </span>
                    <Badge
                      className={`${getStatusColor(bill.statusBill || 'Unpaid')} max-[430px]:px-1 max-[430px]:py-0 max-[430px]:text-xs`}
                    >
                      {bill.statusBill === 'Paid' ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </td>
                  <td
                    colSpan={3}
                    className='px-3 py-2 text-right font-semibold max-[430px]:px-1 max-[430px]:py-1 max-[430px]:text-xs dark:border-gray-600'
                  >
                    Total Payment:
                  </td>
                  <td className='px-3 py-2 text-center font-bold text-green-600 max-[430px]:px-1 max-[430px]:py-1 max-[430px]:text-xs'>
                    ${totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {(hasFileAttachment() || hasImageUpload()) && (
          <div className='mb-0 rounded-lg border-gray-200 bg-white p-2 max-[430px]:p-1 dark:border-gray-700 dark:bg-gray-800'>
            <div className='flex flex-wrap items-center gap-6 max-[430px]:gap-3'>
              <h3 className='flex items-center gap-2 text-sm font-semibold text-gray-900 max-[430px]:text-xs dark:text-gray-100'>
                <Paperclip className='h-5 w-5 max-[430px]:h-4 max-[430px]:w-4' />
                Attachments
              </h3>
              {hasFileAttachment() && (
                <div className='flex items-center gap-2 max-[430px]:gap-1'>
                  <FileText className='h-4 w-4 text-gray-500 max-[430px]:h-3 max-[430px]:w-3' />
                  <button
                    onClick={() => openFile(bill.fileAttachmentBill!, 'file')}
                    className='text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline max-[430px]:text-xs dark:text-blue-400'
                  >
                    View Document
                  </button>
                </div>
              )}
              {hasImageUpload() && (
                <div className='flex items-center gap-2 max-[430px]:gap-1'>
                  <ImageIcon className='h-4 w-4 text-gray-500 max-[430px]:h-3 max-[430px]:w-3' />
                  <button
                    onClick={() => openFile(bill.imageUploadBill!, 'image')}
                    className='text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline max-[430px]:text-xs dark:text-blue-400'
                  >
                    View Image
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className='px-2 text-sm text-black italic max-[430px]:px-1 max-[430px]:text-xs dark:text-gray-300'>
          <p className='flex items-center gap-2 text-sm font-semibold max-[430px]:text-xs'>
            <InfoIcon className='h-4 w-4 max-[430px]:h-3 max-[430px]:w-3' />
            Note:
          </p>
          <ul className='mt-2 list-disc space-y-1 pl-5 max-[430px]:mt-1 max-[430px]:space-y-0.5 max-[430px]:pl-4'>
            <li>This invoice is valid only when signed and stamped by the seller.</li>
            <li>Please retain this invoice for warranty and accounting purposes.</li>
            <li>All prices are inclusive of applicable taxes (if any).</li>
            <li>Goods/services sold are non-refundable unless otherwise stated.</li>
            <li>Contact our support team if any discrepancies are found.</li>
          </ul>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-3 max-[430px]:p-2 dark:border-gray-700 dark:bg-gray-800'>
          <div className='grid grid-cols-2 gap-10 pt-6 text-sm text-gray-700 max-[430px]:gap-4 max-[430px]:pt-3 max-[430px]:text-xs dark:text-gray-300'>
            <div className='text-center'>
              <p className='mb-1 font-semibold text-gray-900 dark:text-gray-100'>Buyer</p>
              <p className='mb-8 text-xs max-[430px]:mb-4 max-[430px]:text-xs'>(Signature and full name)</p>
              <div className='border-gray-400 pb-2 max-[430px]:pb-1'>
                <p className='font-semibold'>_________________</p>
              </div>
            </div>
            <div className='text-center'>
              <p className='mb-1 font-semibold text-gray-900 dark:text-gray-100'>Seller</p>
              <p className='mb-8 text-xs max-[430px]:mb-4 max-[430px]:text-xs'>(Signature and full name)</p>
              <div className='border-gray-400 pb-2 max-[430px]:pb-1'>
                <p className='font-semibold'>{bill.creator?.fullName}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BillDetailModal
