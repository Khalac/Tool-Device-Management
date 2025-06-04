import { useParams, Link, useNavigate } from 'react-router-dom'
import type { AssetsType } from '../view-all-assets/model'
import { getData, tryCatch } from '@/utils'
import { useEffect, useTransition } from 'react'
import { deleteAsset, getAssetInformation } from '../api'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  LoadingSpinner,
} from '@/components/ui'

import { ArrowLeft, Pencil, Loader2, Trash2 } from 'lucide-react'

import { AssetBadge, AssetFile, AssetImage, AssetInformation, AssetQR, NoAsset } from './_components'
import { ViewAssetLog } from '../view-asset-log'
import { toast } from 'sonner'

const GetAssetDetail = () => {
  const { id } = useParams()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeletingTransition] = useTransition()
  const [asset, setAsset] = useState<AssetsType>()
  const navigate = useNavigate()

  const getAssetData = () => {
    startTransition(async () => {
      if (!id) return
      await getData(() => getAssetInformation(id), setAsset)
    })
  }
  const deletingAsset = () => {
    if (!id) return
    startDeletingTransition(async () => {
      const response = await tryCatch(deleteAsset(id))
      if (response.error) {
        toast.error(response.error.message || 'Failed to delete asset')
        return
      }
      toast.success('Asset deleted successfully')
      navigate('/assets')
    })
  }

  useEffect(() => {
    getAssetData()
  }, [id])

  if (isPending) {
    return (
      <div className='flex h-[70vh] items-center justify-center'>
        <Loader2 className='text-primary h-12 w-12 animate-spin' />
      </div>
    )
  }

  if (!asset) {
    return <NoAsset id={id || ''} />
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center'>
          <Link to='/assets'>
            <Button
              variant='ghost'
              className='mr-4'
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
          </Link>
          <h1 className='text-3xl font-semibold'>{asset.assetName}</h1>
          <AssetBadge asset={asset} />
        </div>
        {asset.status !== 'Disposed' && (
          <div className='flex items-center space-x-2'>
            <Link to={`/assets/update/${id}`}>
              <Button variant='outline'>
                <Pencil className='mr-2 h-4 w-4' />
                Update Asset
              </Button>
            </Link>

            <Button
              variant='destructive'
              onClick={deletingAsset}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <LoadingSpinner className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete Asset
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div
        className='grid grid-cols-1 gap-6 lg:grid-cols-3'
        style={{ gridAutoRows: '1fr' }}
      >
        <div className='flex flex-col gap-6 lg:col-span-2'>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Asset Information</CardTitle>
              <CardDescription>Details about the hardware asset</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <AssetInformation asset={asset} />
            </CardContent>
          </Card>

          <ViewAssetLog id={id || ''} />
        </div>

        <div className='flex'>
          <Tabs
            defaultValue='image'
            className='flex w-full flex-col'
          >
            <TabsList className='w-full'>
              <TabsTrigger
                value='image'
                className='flex-1'
              >
                Image
              </TabsTrigger>
              <TabsTrigger
                value='documents'
                className='flex-1'
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value='qr'
                className='flex-1'
              >
                QR
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value='image'
              className='mt-4 flex flex-grow'
            >
              <Card className='w-full'>
                <CardContent className='flex h-full items-center justify-center py-4'>
                  <AssetImage asset={asset} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value='documents'
              className='mt-4 flex flex-grow'
            >
              <Card className='w-full'>
                <CardContent className='flex h-full items-center justify-center py-4'>
                  <AssetFile asset={asset} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value='qr'
              className='mt-4 flex flex-grow'
            >
              <Card className='w-full'>
                <CardContent className='flex h-full items-center justify-center py-4'>
                  <AssetQR asset={asset} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default GetAssetDetail
