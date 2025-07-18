import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  Badge,
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui'
import type { AssetsType } from '../model'
import { Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '@/lib'

export const ViewCardsDataAssets = ({ assets }: { assets: AssetsType[] }) => {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const totalPages = Math.ceil(assets.length / 3)
  const currentAssets = assets.slice((currentPage - 1) * 3, currentPage * 3)

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {currentAssets.map((asset) => (
          <Card
            key={asset.id}
            className='flex h-full flex-row overflow-hidden p-0 transition-all hover:shadow-md'
          >
            <div className='bg-muted relative aspect-auto h-62 w-1/2 overflow-hidden'>
              <img
                src={asset.imageUpload}
                alt={asset.assetName}
                className='h-full w-full object-contain'
              />
            </div>

            <div className='flex flex-col items-center justify-between py-6'>
              <div>
                <CardHeader className='px-4 pt-4 pb-0'>
                  <CardTitle
                    className='line-clamp-1 text-lg'
                    title={asset.assetName}
                  >
                    {asset.assetName}
                  </CardTitle>
                  <CardDescription className='flex items-center gap-2'>
                    <span className='font-mono text-xs'>{asset.serialNumber}</span>
                    <Badge
                      variant='outline'
                      className={cn(
                        'ml-4 flex items-center gap-1',
                        asset.status === 'New' && 'border-green-200 bg-green-100 text-green-800',
                        asset.status === 'In Use' && 'border-blue-200 bg-blue-100 text-blue-800',
                        asset.status === 'Under Maintenance' && 'border-amber-200 bg-amber-100 text-amber-800',
                        asset.status === 'Retired' && 'border-slate-200 bg-slate-100 text-slate-800',
                        asset.status === 'Disposed' && 'border-red-200 bg-red-100 text-red-800'
                      )}
                    >
                      {asset.status}
                    </Badge>
                  </CardDescription>
                </CardHeader>

                <CardContent className='flex flex-grow flex-col gap-2 px-4 py-2'>
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center justify-between gap-3'>
                      <span className='text-muted-foreground'>Department:</span>
                      <span className='max-w-[120px] truncate font-medium'>{asset.department?.departmentName}</span>
                    </div>
                  </div>
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center justify-between gap-3'>
                      <span className='text-muted-foreground'>Category:</span>
                      <span className='max-w-[120px] truncate font-medium'>{asset.category?.categoryName}</span>
                    </div>
                  </div>
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center justify-between gap-3'>
                      <span className='text-muted-foreground'>Cost:</span>
                      <span className='max-w-[120px] truncate font-medium'>${asset.cost}</span>
                    </div>
                  </div>
                </CardContent>
              </div>
              <CardFooter className=''>
                <Button
                  variant='outline'
                  size='sm'
                  className='border-primary text-primary hover:text-primary/80 w-full'
                  asChild
                >
                  <Link to={`/assets/${asset.id}`}>
                    <Info className='text-primary mr-2 h-4 w-4' />
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => handleChangePage(currentPage - 1)} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => handleChangePage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => handleChangePage(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
