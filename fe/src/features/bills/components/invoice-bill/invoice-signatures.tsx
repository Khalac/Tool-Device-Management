interface InvoiceSignaturesProps {
  buyerName: string
  sellerName: string
  className?: string
  isCompact?: boolean
}

export const InvoiceSignatures = ({
  buyerName,
  sellerName,
  className = '',
  isCompact = false,
}: InvoiceSignaturesProps) => {
  const padding = isCompact ? 'p-3' : 'p-3 max-[430px]:p-2'
  const textSize = isCompact ? 'text-sm' : 'text-sm max-[430px]:text-xs'
  const gap = isCompact ? 'gap-10 pt-1' : 'gap-10 pt-6 max-[430px]:gap-4 max-[430px]:pt-3'
  const marginBottom = isCompact ? 'mb-8' : 'mb-8 max-[430px]:mb-4'

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${padding} ${className}`}
    >
      <div className={`grid grid-cols-2 text-gray-700 dark:text-gray-300 ${gap} ${textSize}`}>
        <div className='text-center'>
          <p className='mb-1 font-semibold text-gray-900 dark:text-gray-100'>Buyer</p>
          <p className={`text-xs ${marginBottom}`}>(Signature and full name)</p>
          <div className='border-gray-400 pb-2 max-[430px]:pb-1'>
            <p className='font-semibold'>{buyerName}</p>
          </div>
        </div>
        <div className='text-center'>
          <p className='mb-1 font-semibold text-gray-900 dark:text-gray-100'>Seller</p>
          <p className={`text-xs ${marginBottom}`}>(Signature and full name)</p>
          <div className='border-gray-400 pb-2 max-[430px]:pb-1'>
            <p className='font-semibold'>{sellerName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
