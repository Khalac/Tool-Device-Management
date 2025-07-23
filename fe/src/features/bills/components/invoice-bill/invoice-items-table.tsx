import { Badge } from '@/components/ui'

interface InvoiceItem {
  stt: number
  assetName: string
  category: string
  quantity: number
  unitPrice: number
  amount: number
}

interface InvoiceItemsTableProps {
  items: InvoiceItem[]
  status: string
  totalAmount: number
  getStatusColor: (status: string) => string
  className?: string
  isCompact?: boolean
}

export const InvoiceItemsTable = ({
  items,
  status,
  totalAmount,
  getStatusColor,
  className = '',
  isCompact = false,
}: InvoiceItemsTableProps) => {
  const cellClasses = isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-2 max-[430px]:px-1 max-[430px]:py-1'

  return (
    <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm max-[430px]:text-xs'>
          <thead className='bg-gray-50 dark:bg-gray-700'>
            <tr className='border-b dark:border-gray-600'>
              <th
                className={`border-r text-center text-xs font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-300 ${cellClasses}`}
              >
                No.
              </th>
              <th
                className={`border-r text-center text-xs font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-300 ${cellClasses}`}
              >
                Asset Name
              </th>
              <th
                className={`border-r text-center text-xs font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-300 ${cellClasses}`}
              >
                Category
              </th>
              <th
                className={`border-r text-center text-xs font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-300 ${cellClasses}`}
              >
                Quantity
              </th>
              <th
                className={`border-r text-center text-xs font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-300 ${cellClasses}`}
              >
                Unit Price
              </th>
              <th className={`text-center text-xs font-semibold text-gray-900 dark:text-gray-300 ${cellClasses}`}>
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
                <td className={`border-r text-center dark:border-gray-600 ${cellClasses}`}>{item.stt}</td>
                <td className={`border-r text-center dark:border-gray-600 ${cellClasses}`}>{item.assetName}</td>
                <td className={`border-r text-center dark:border-gray-600 ${cellClasses}`}>{item.category}</td>
                <td className={`border-r text-center dark:border-gray-600 ${cellClasses}`}>{item.quantity}</td>
                <td className={`border-r text-center dark:border-gray-600 ${cellClasses}`}>
                  ${item.unitPrice.toLocaleString()}
                </td>
                <td className={`text-center ${cellClasses}`}>${item.amount.toLocaleString()}</td>
              </tr>
            ))}
            {[...Array(2)].map((_, index) => (
              <tr
                key={`empty-${index}`}
                className='border-b dark:border-gray-600'
              >
                <td className={`border-r text-center dark:border-gray-600 ${cellClasses}`}>&nbsp;</td>
                <td className={`border-r dark:border-gray-600 ${cellClasses}`}>&nbsp;</td>
                <td className={`border-r text-center dark:border-gray-600 ${cellClasses}`}>&nbsp;</td>
                <td className={`border-r text-center dark:border-gray-600 ${cellClasses}`}>&nbsp;</td>
                <td className={`border-r text-right dark:border-gray-600 ${cellClasses}`}>&nbsp;</td>
                <td className={`text-right ${cellClasses}`}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
          <tfoot className='bg-gray-50 dark:bg-gray-700'>
            <tr className='border-b dark:border-gray-600'>
              <td
                colSpan={2}
                className={`text-left text-sm font-semibold text-gray-900 dark:text-gray-300 ${cellClasses}`}
              >
                <span className={`text-right dark:border-gray-600 ${cellClasses}`}>Status:</span>
                <Badge
                  className={`${getStatusColor(status)} ${isCompact ? 'px-1 py-0 text-xs' : 'max-[430px]:px-1 max-[430px]:py-0 max-[430px]:text-xs'}`}
                >
                  {status === 'Paid' ? 'Paid' : 'Unpaid'}
                </Badge>
              </td>
              <td
                colSpan={3}
                className={`text-right font-semibold dark:border-gray-600 ${cellClasses}`}
              >
                Total Payment:
              </td>
              <td className={`text-center font-bold text-green-600 ${cellClasses}`}>${totalAmount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
