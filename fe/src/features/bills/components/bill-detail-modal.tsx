import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'
import { Receipt, InfoIcon } from 'lucide-react'
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

interface BillDetailModalProps {
  bill: BillType | null
  open: boolean
  onClose: () => void
  onStatusChange?: (billId: number, newStatus: 'Unpaid' | 'Paid') => void
}

export const BillDetailModal = ({ bill, open, onClose }: BillDetailModalProps) => {
  if (!bill) return null

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose()
    }
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

  const sellerInfo = getSellerInfo()
  const buyerInfo = getBuyerInfo(bill)
  const items = getInvoiceItems(bill)
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

        <InvoiceHeader
          bill={bill}
          formatDate={formatDateShort}
          showQR={true}
        />

        <SellerBuyerInfo
          sellerInfo={sellerInfo}
          buyerInfo={buyerInfo}
        />

        <InvoiceItemsTable
          items={items}
          status={bill.statusBill || 'Unpaid'}
          totalAmount={totalAmount}
          getStatusColor={getStatusColor}
        />

        <InvoiceAttachments
          bill={bill}
          onOpenFile={openFile}
          className='mb-0'
        />

        <div className='px-2 text-sm text-black italic max-[430px]:px-1 max-[430px]:text-xs dark:text-gray-300'>
          <p className='flex items-center gap-2 text-sm font-semibold max-[430px]:text-xs'>
            <InfoIcon className='h-4 w-4 max-[430px]:h-3 max-[430px]:w-3' />
            Note:
          </p>
          <ul className='mt-2 list-disc space-y-1 pl-5 max-[430px]:mt-1 max-[430px]:space-y-0.5 max-[430px]:pl-4'>
            <li>This invoice is valid only when signed and stamped by the seller.</li>
            <li>Contact our support team if any discrepancies are found.</li>
          </ul>
        </div>

        <InvoiceSignatures
          buyerName={bill.buyer?.buyerName || 'N/A'}
          sellerName={bill.creator?.fullName || 'Unknown'}
        />
      </DialogContent>
    </Dialog>
  )
}

export default BillDetailModal
