interface SellerInfo {
  companyName: string
  taxCode: string
  address: string
  phoneNumber: string
  accountNumber: string
}

interface BuyerInfo {
  name: string
  address: string
  phoneNumber: string
  email: string
}

interface SellerBuyerInfoProps {
  sellerInfo: SellerInfo
  buyerInfo: BuyerInfo
  className?: string
}

export const SellerBuyerInfo = ({ sellerInfo, buyerInfo, className = '' }: SellerBuyerInfoProps) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
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
        <h3 className='border-b pb-2 font-semibold text-gray-900 max-[430px]:pb-1 dark:border-gray-600 dark:text-gray-100'>
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
        <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
          Email: <span className='font-normal'>{buyerInfo.email}</span>
        </h3>
      </div>
    </div>
  )
}
