import { Badge } from '@/components/ui'
import { Paperclip, Image as ImageIcon, FileText, InfoIcon } from 'lucide-react'
import type { BillType } from '../model/bill-types'
import { BillQR } from './bill-qr'

interface BillPrintLayoutProps {
  bill: BillType
}

export const BillPrintLayout = ({ bill }: BillPrintLayoutProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      Unpaid: 'bg-red-100 text-red-800 border-red-200',
      Paid: 'bg-green-100 text-green-800 border-green-200',
      Cancelled: 'bg-red-100 text-red-800 border-red-200',
      Draft: 'bg-gray-100 text-gray-800 border-gray-200',
    } as const
    return colors[status as keyof typeof colors] || colors.Unpaid
  }

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
    if (Array.isArray(bill.assets)) {
      return bill.assets.map((asset) => asset.assetName).join(', ')
    }
    return bill.assets?.assetName || 'Unknown Asset'
  }

  const getCategoryName = () => {
    if (Array.isArray(bill.assets)) {
      const categories = bill.assets.map((asset) => asset.category?.categoryName).filter(Boolean)
      return [...new Set(categories)].join(', ') || 'No Category'
    }
    return bill.assets?.category?.categoryName || 'No Category'
  }

  const getAssetCost = () => {
    if (Array.isArray(bill.assets)) {
      return bill.assets.reduce((total, asset) => total + (asset.cost || 0), 0)
    }
    if (bill.assets?.cost !== undefined && bill.assets.cost !== null) {
      return bill.assets.cost
    }
    return bill.amount || 0
  }

  const hasFileAttachment = () => {
    return bill.fileAttachmentBill && bill.fileAttachmentBill.trim() !== '' && bill.fileAttachmentBill !== 'null'
  }

  const hasImageUpload = () => {
    return bill.imageUploadBill && bill.imageUploadBill.trim() !== '' && bill.imageUploadBill !== 'null'
  }

  const sellerInfo = {
    companyName: 'SUNRISE SOFTWARE SOLUTIONS CORPORATION',
    taxCode: '0305089644',
    address: '307/12 Nguyen Van Troi, Ward 1, Tan Binh District, HCMC, Viet Nam',
    phoneNumber: '028-35471411',
    accountNumber: '1982738238232',
  }

  const buyerInfo = {
    name: bill.buyer?.buyerName || 'N/A',
    address: bill.buyer?.buyerAddress || 'N/A',
    phoneNumber: bill.buyer?.buyerPhone || 'N/A',
    email: bill.buyer?.buyerEmail || 'N/A',
    // taxCode: '',
    // accountNumber: '4568239472356',
    // paymentMethod: 'Bank Transfer',
  }

  const getItems = () => {
    if (Array.isArray(bill.assets)) {
      return bill.assets.map((asset, index) => ({
        stt: index + 1,
        assetName: asset.assetName,
        category: asset.category?.categoryName || 'No Category',
        quantity: 1,
        unitPrice: asset.cost || 0,
        amount: asset.cost || 0,
      }))
    } else if (bill.assets) {
      return [
        {
          stt: 1,
          assetName: bill.assets.assetName,
          category: bill.assets.category?.categoryName || getCategoryName(),
          quantity: 1,
          unitPrice: bill.assets.cost || getAssetCost(),
          amount: bill.assets.cost || getAssetCost(),
        },
      ]
    } else {
      return [
        {
          stt: 1,
          assetName: getAssetName(),
          category: getCategoryName(),
          quantity: 1,
          unitPrice: getAssetCost(),
          amount: getAssetCost(),
        },
      ]
    }
  }

  const items = getItems()
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className='bill-print-container min-h-screen bg-white p-8 text-black'>
      <style>{`
        @media print {
          .bill-print-container {
            padding: 15px;
            background: white !important;
            color: black !important;
            font-size: 12px;
          }
          .no-print {
            display: none !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:text-gray-900, .print\\:text-black {
            color: #111827 !important;
          }
          .print\\:text-gray-700 {
            color: #374151 !important;
          }
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          .print\\:border {
            border: 1px solid #d1d5db !important;
          }
          .print-signature {
            border-top: 2px solid #000 !important;
            padding-top: 8px !important;
          }
          .page-break {
            page-break-after: always;
          }
        }
        
        @page {
          margin: 1cm;
          size: A4;
        }
      `}</style>

      <div className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div className='flex-shrink-0'>
            <img
              src='https://www.s3corp.com.vn/images/S3CORP.svg?w=128&q=75'
              alt='Company Logo'
              className='h-14 w-auto object-contain'
            />
          </div>

          <div className='flex flex-1 flex-col items-center justify-center text-center'>
            <div className='bg-red-500 px-4 py-2 text-lg font-bold text-white'>SALES INVOICE</div>
            <p className='mt-1 text-sm text-gray-700 dark:text-gray-300'>
              Date: <span className='font-semibold'>{formatDateShort(bill.updateAt || bill.createAt)}</span>
            </p>
          </div>

          <div className='flex items-start gap-4'>
            <div className='flex flex-col items-end justify-between gap-1'>
              <p className='text-sm text-gray-600 dark:text-gray-100'>
                Form No.: <span className='font-semibold'>2C24TTU</span>
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-100'>
                Invoice No.: <span className='font-semibold'>{bill.billNumber}</span>
              </p>
            </div>

            <div>
              <BillQR bill={bill} />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
        <h3 className='mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100'>
          Seller: <span className='font-normal'>{sellerInfo.companyName}</span>
        </h3>
        <div className='grid grid-cols-1 gap-2 text-sm'>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
            Tax Code: <span className='font-normal'>{sellerInfo.taxCode}</span>
          </h3>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
            Address: <span className='font-normal'>{sellerInfo.address}</span>
          </h3>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
            Phone: <span className='font-normal'>{sellerInfo.phoneNumber}</span>
          </h3>
          <h3 className='border-b border-gray-200 pb-2 font-semibold text-gray-900 dark:text-gray-100'>
            Account No.: <span className='font-normal'>{sellerInfo.accountNumber}</span>
          </h3>

          <h3 className='mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100'>
            Buyer: <span className='font-normal'>{buyerInfo.name}</span>
          </h3>
          {/* <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
            Tax Code: <span className='font-normal'>{buyerInfo.taxCode || '_________________'}</span>
          </h3> */}
          <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
            Address: <span className='font-normal'>{buyerInfo.address}</span>
          </h3>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
            Phone: <span className='font-normal'>{buyerInfo.phoneNumber}</span>
          </h3>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
            Email: <span className='font-normal'>{buyerInfo.email}</span>
          </h3>
          {/* <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
            Account No.: <span className='font-normal'>{buyerInfo.accountNumber}</span>
          </h3>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
            Payment Method: <span className='font-normal'>{buyerInfo.paymentMethod}</span>
          </h3> */}
        </div>
      </div>

      <div className='mt-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr className='border-b dark:border-gray-600'>
                <th className='border-r px-3 py-2 text-center text-xs font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-300'>
                  No.
                </th>
                <th className='border-r px-3 py-2 text-center text-xs font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-300'>
                  Asset Name
                </th>
                <th className='border-r px-3 py-2 text-center text-xs font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-300'>
                  Category
                </th>
                <th className='border-r px-3 py-2 text-center text-xs font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-300'>
                  Quantity
                </th>
                <th className='border-r px-3 py-2 text-center text-xs font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-300'>
                  Unit Price
                </th>
                <th className='px-3 py-2 text-center text-xs font-semibold text-gray-900 dark:text-gray-300'>Amount</th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800'>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className='border-b dark:border-gray-600'
                >
                  <td className='border-r px-3 py-2 text-center dark:border-gray-600'>{item.stt}</td>
                  <td className='border-r px-3 py-2 text-center dark:border-gray-600'>{item.assetName}</td>
                  <td className='border-r px-3 py-2 text-center dark:border-gray-600'>{item.category}</td>
                  <td className='border-r px-3 py-2 text-center dark:border-gray-600'>{item.quantity}</td>
                  <td className='border-r px-3 py-2 text-center dark:border-gray-600'>
                    ${item.unitPrice.toLocaleString()}
                  </td>
                  <td className='px-3 py-2 text-center'>${item.amount.toLocaleString()}</td>
                </tr>
              ))}
              {[...Array(2)].map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  className='border-b dark:border-gray-600'
                >
                  <td className='border-r px-3 py-2 text-center dark:border-gray-600'>&nbsp;</td>
                  <td className='border-r px-3 py-2 dark:border-gray-600'>&nbsp;</td>
                  <td className='border-r px-3 py-2 text-center dark:border-gray-600'>&nbsp;</td>
                  <td className='border-r px-3 py-2 text-center dark:border-gray-600'>&nbsp;</td>
                  <td className='border-r px-3 py-2 text-right dark:border-gray-600'>&nbsp;</td>
                  <td className='px-3 py-2 text-right'>&nbsp;</td>
                </tr>
              ))}
            </tbody>
            <tfoot className='bg-gray-50 dark:bg-gray-700'>
              <tr className='border-b dark:border-gray-600'>
                <td
                  colSpan={2}
                  className='px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-300'
                >
                  <span className='px-3 py-2 text-right dark:border-gray-600'>Status:</span>
                  <Badge className={getStatusColor(bill.statusBill || 'Unpaid')}>
                    {bill.statusBill === 'Paid' ? 'Paid' : 'Unpaid'}
                  </Badge>
                </td>
                <td
                  colSpan={3}
                  className='px-3 py-2 text-right font-semibold dark:border-gray-600'
                >
                  Total Payment:
                </td>
                <td className='px-3 py-2 text-center font-bold text-green-600'>${totalAmount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      {(hasFileAttachment() || hasImageUpload()) && (
        <div className='mt-2 rounded-lg border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800'>
          <div className='flex flex-col gap-y-[2px]'>
            <h3 className='flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100'>
              <Paperclip className='h-4 w-4' />
              Attachments
            </h3>

            {hasFileAttachment() && (
              <div className='flex items-center gap-3'>
                <FileText className='h-4 w-4 text-gray-500' />
                <a
                  href={bill.fileAttachmentBill!}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs break-all text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400'
                >
                  File: {bill.fileAttachmentBill}
                </a>
              </div>
            )}

            {hasImageUpload() && (
              <div className='flex items-center gap-3'>
                <ImageIcon className='h-4 w-4 text-gray-500' />
                <a
                  href={bill.imageUploadBill!}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs break-all text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400'
                >
                  Image: {bill.imageUploadBill}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      <div className='mb-2 px-2 text-sm text-gray-700 italic dark:text-gray-300'>
        <p className='flex items-center gap-2 font-semibold'>
          <InfoIcon className='h-4 w-4' />
          Note:
        </p>
        <ul className='list-disc pl-5 text-[0.6rem]'>
          <li>This invoice is valid only when signed and stamped by the seller.</li>
          <li>Contact our support team if any discrepancies are found.</li>
        </ul>
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800'>
        <div className='grid grid-cols-2 gap-10 pt-1 text-sm text-gray-700 dark:text-gray-300'>
          <div className='text-center'>
            <p className='mb-1 font-semibold text-gray-900 dark:text-gray-100'>Buyer</p>
            <p className='mb-8 text-xs'>(Signature and full name)</p>
            <div className='border-gray-400 pb-1'>
              <p className='font-semibold'>{buyerInfo.name}</p>
            </div>
          </div>
          <div className='text-center'>
            <p className='mb-1 font-semibold text-gray-900 dark:text-gray-100'>Seller</p>
            <p className='mb-8 text-xs'>(Signature and full name)</p>
            <div className='border-gray-400 pb-1'>
              <p className='font-semibold'>{bill.creator?.fullName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
