import { InfoIcon } from 'lucide-react'
import { InvoiceHeader } from './invoice-bill/invoice-header'
import { SellerBuyerInfo } from './invoice-bill/seller-buyer-info'
import { InvoiceItemsTable } from './invoice-bill/invoice-items-table'
import { InvoiceAttachments } from './invoice-bill/invoice-attachments'
import { InvoiceSignatures } from './invoice-bill/invoice-signatures'
import {
  getStatusColor,
  formatDateShort,
  getInvoiceItems,
  getSellerInfo,
  getBuyerInfo,
} from './invoice-bill/invoice-utils'
import type { BillType } from '../model/bill-types'

interface BillPrintLayoutProps {
  bill: BillType
}

export const BillPrintLayout = ({ bill }: BillPrintLayoutProps) => {
  const sellerInfo = getSellerInfo()
  const buyerInfo = getBuyerInfo(bill)
  const items = getInvoiceItems(bill)
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className='mx-auto max-w-4xl bg-white p-6 text-black dark:bg-gray-900 dark:text-white'>
      <InvoiceHeader
        bill={bill}
        formatDate={formatDateShort}
        showQR={true}
        className='mt-4'
      />

      <SellerBuyerInfo
        sellerInfo={sellerInfo}
        buyerInfo={buyerInfo}
        className='mt-4'
      />

      <InvoiceItemsTable
        items={items}
        status={bill.statusBill || 'Unpaid'}
        totalAmount={totalAmount}
        getStatusColor={getStatusColor}
        className='mt-4'
        isCompact={true}
      />

      <InvoiceAttachments
        bill={bill}
        className='mt-2'
        isCompact={true}
      />

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

      <InvoiceSignatures
        buyerName={buyerInfo.name}
        sellerName={bill.creator?.fullName || 'Unknown'}
        isCompact={true}
      />
    </div>
  )
}
