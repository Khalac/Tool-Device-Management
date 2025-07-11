import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { deleteAsset, getAssetInformation } from '../api'
import { getData, tryCatch } from '@/utils'
import { useAppSelector } from '@/hooks'
import { toast } from 'sonner'

import type { AssetsType } from '../view-all-assets/model'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  LoadingSpinner,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui'

import { ArrowLeft, Pencil, Loader2, Trash2, MoreVertical, FileText } from 'lucide-react'

import { AssetBadge, AssetImage, AssetInformation, AssetMaintenanceSchedule, NoAsset } from './_components'

import { CompareSimilarAssets } from './_components/compare-similar-assets'
import { ViewAssetLog } from '../view-asset-log'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'

const GetAssetDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const role = user.role.slug

  const [isPending, setIsPending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [asset, setAsset] = useState<AssetsType>()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const canEditAsset = () => {
    if (role === 'admin') return true
    if (role === 'assetManager') {
      return user.department && asset?.department?.id === user.department.id
    }
    return false
  }

  const getAssetData = async () => {
    setIsPending(true)
    if (!id) return
    await getData(() => getAssetInformation(id), setAsset)
    setIsPending(false)
  }

  const deletingAsset = async () => {
    setIsDeleting(true)
    if (!id) return
    const response = await tryCatch(deleteAsset(id))
    if (response.error) {
      toast.error(response.error.message || 'Failed to delete asset')
      setIsDeleting(false)
      setShowDeleteModal(false)
      return
    }
    toast.success('Asset deleted successfully')
    navigate('/assets')
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
    <div className='container mx-auto px-4 py-4 sm:py-8'>
      <div className='mx-auto w-3/5'>
        <div className='mb-6 flex items-center gap-4'>
          <Link to='/assets'>
            <Button
              variant='ghost'
              className='-ml-2 p-2'
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
          </Link>
          <h1 className='text-xl font-semibold sm:text-2xl lg:text-3xl'>{asset.assetName}</h1>
          <AssetBadge asset={asset} />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2'>
          <div className='flex flex-col gap-4 sm:gap-6 xl:col-span-2'>
            <Card className='relative w-full'>
              <CardHeader className='relative'>
                <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                  <FileText className='h-5 w-5' />
                  Asset Information
                </CardTitle>
                <CardDescription>Details about the hardware asset</CardDescription>

                {asset.status !== 'Disposed' && canEditAsset() && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='absolute top-2 right-2'
                      >
                        <MoreVertical className='text-muted-foreground h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align='end'
                      className='w-50'
                    >
                      <DropdownMenuItem asChild>
                        <CompareSimilarAssets
                          currentAsset={asset}
                          className='hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer border-none font-semibold'
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to={`/assets/update/${id}`}
                          className='flex w-full cursor-pointer items-center font-semibold'
                        >
                          <Pencil className='mr-2 h-4 w-4' />
                          Update Asset
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setShowDeleteModal(true)}
                        disabled={isDeleting}
                        className='cursor-pointer font-semibold text-red-600 focus:text-red-600'
                      >
                        {isDeleting ? (
                          <>
                            <LoadingSpinner className='mr-2 h-4 w-4 animate-spin' />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className='mr-2 h-4 w-4 text-red-600' />
                            Delete Asset
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CardHeader>

              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
                  <div className='lg:col-span-2'>
                    <Card className='h-full border-none'>
                      <CardContent className='flex h-full min-h-[250px] items-center justify-center p-4'>
                        <AssetImage asset={asset} />
                      </CardContent>
                    </Card>
                  </div>

                  <div className='lg:col-span-3'>
                    <AssetInformation asset={asset} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {role !== 'employee' &&
              (role === 'admin' ||
                (role === 'assetManager' && (user as any).department?.id === asset?.department?.id)) && (
                <ViewAssetLog id={id || ''} />
              )}

            {role !== 'employee' && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg sm:text-xl'>Maintenance Schedule</CardTitle>
                  <CardDescription>Upcoming and past maintenance schedules</CardDescription>
                </CardHeader>
                <CardContent>
                  <AssetMaintenanceSchedule id={id || ''} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deletingAsset}
        title='Confirm Delete'
        itemName={asset?.assetName}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default GetAssetDetail
