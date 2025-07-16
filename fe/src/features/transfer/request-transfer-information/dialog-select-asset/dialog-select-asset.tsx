import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Form,
  FormSelect,
} from '@/components/ui'
import { Check, Loader2, Package, Undo } from 'lucide-react'
import { type ApproveFormValues, approveFormSchema } from './model'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useEffect } from 'react'
import { getData } from '@/utils'
import { getAllAssetsOfCategory } from '@/features/assets/api'

export const DialogSelectAsset = ({
  categoryId,
  departmentId,
  isDialogOpen,
  setIsDialogOpen,
  handleApprove,
  isProcessing,
}: {
  categoryId: string
  departmentId: string
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleApprove: (data: ApproveFormValues) => void
  isProcessing: boolean
}) => {
  const [assets, setAssets] = useState<any[]>([])
  const [isLoadingAssets, setIsLoadingAssets] = useState(false)

  const fetchAvailableAssets = async () => {
    setIsLoadingAssets(true)
    await getData(() => getAllAssetsOfCategory(categoryId, departmentId), setAssets)
    setIsLoadingAssets(false)
  }
  const form = useForm<ApproveFormValues>({
    resolver: zodResolver(approveFormSchema),
    defaultValues: {
      assetId: '',
    },
  })

  useEffect(() => {
    fetchAvailableAssets()
  }, [])
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Package className='h-5 w-5' />
            Select Asset for Transfer
          </DialogTitle>
          <DialogDescription>Choose an asset to transfer.</DialogDescription>
        </DialogHeader>
        {isLoadingAssets ? (
          <div className='flex items-center gap-2 py-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span>Loading available assets...</span>
          </div>
        ) : assets.length === 0 ? (
          <div className='rounded-md bg-gray-50 p-4 text-center font-medium text-black'>
            No available assets to transfer in this category.
          </div>
        ) : (
          <FormProvider {...form}>
            <Form {...form}>
              <FormSelect
                data={assets}
                name='assetId'
                label='Asset'
                placeholder='Select asset to transfer'
              />
            </Form>
          </FormProvider>
        )}

        <DialogFooter>
          <Button
            className='border-primary text-primary hover:text-primary/80'
            variant='outline'
            type='button'
            onClick={() => setIsDialogOpen(false)}
            disabled={isProcessing}
          >
            <Undo className='h-4 w-4' />
            Cancel
          </Button>
          <Button
            type='submit'
            onClick={form.handleSubmit(handleApprove)}
            disabled={isProcessing || assets.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              <>
                <Check className='mr-1 h-4 w-4' />
                Confirm Transfer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
