import { BellRing, CheckCheck, Edit, PlusCircle, Shuffle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LoadingSpinner,
} from '@/components/ui'
import { tryCatch } from '@/utils'
import { getAllNotifications, updateReadNotification } from '../api'
import { toast } from 'sonner'
import type { NotificationType } from './model'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import Cookies from 'js-cookie'
import { EventSourcePolyfill } from 'event-source-polyfill'

const NumberNotification = () => {
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [isPending, setIsPending] = useState(false)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)

  const getNotificationIcon = (content: string) => {
    const lowerContent = content.toLowerCase()

    if (lowerContent.includes('created')) {
      return <PlusCircle className='h-4 w-4 text-green-500' />
    }
    if (lowerContent.includes('updated')) {
      return <Edit className='h-4 w-4 text-blue-500' />
    }
    if (lowerContent.includes('deleted') || lowerContent.includes('delete')) {
      return <Trash2 className='h-4 w-4 text-red-500' />
    }
    if (lowerContent.includes('moved to')) {
      return <Shuffle className='h-4 w-4 text-purple-500' />
    }

    return <BellRing className='h-4 w-4 text-gray-500' />
  }
  const getNotifications = async () => {
    setIsPending(true)
    const response = await tryCatch(getAllNotifications())
    if (response.error) {
      toast.error(response.error.message || 'Failed to fetch notifications')
      return
    }
    const sortedNotifications = response.data.data.sort((a: NotificationType, b: NotificationType) => {
      return new Date(b.notifyDate).getTime() - new Date(a.notifyDate).getTime()
    })

    setNotifications(sortedNotifications)
    setUnreadCount(
      sortedNotifications.filter((notification: NotificationType) => notification.status === 'pending').length
    )
    setIsPending(false)
  }
  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((notification) => notification.status === 'pending')

    if (unreadNotifications.length === 0) {
      toast.info('All notifications are already read')
      return
    }

    setIsMarkingAllRead(true)

    try {
      const updatePromises = unreadNotifications.map((notification) =>
        updateReadNotification(notification.id.toString())
      )

      const results = await Promise.allSettled(updatePromises)

      const failedCount = results.filter((result) => result.status === 'rejected').length

      if (failedCount === 0) {
        toast.success('All notifications marked as read')
        await getNotifications()
      } else {
        toast.warning(`${unreadNotifications.length - failedCount} notifications marked as read, ${failedCount} failed`)
        await getNotifications()
      }
    } catch (error) {
      toast.error('Failed to mark notifications as read')
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  const clickNotification = async (assetId: string, id: string) => {
    const response = await tryCatch(updateReadNotification(id))

    if (response.error) {
      toast.error(response.error.message || 'Failed to seen notification')
      return
    }

    await getNotifications()
    navigate(`assets/${assetId}`)
  }

  const token = Cookies.get('accessToken')

  useEffect(() => {
    const eventSource = new EventSourcePolyfill(`${import.meta.env.VITE_API_URL}sse`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    eventSource.onmessage = async () => {
      await getNotifications()
    }
    return () => eventSource.close()
  }, [])

  useEffect(() => {
    getNotifications()
  }, [])

  return (
    <div className='relative'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative'
          >
            <BellRing
              strokeWidth={2.5}
              className='text-primary h-12 w-12'
            />
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                {isPending ? (
                  <LoadingSpinner className='h-6 w-6 animate-spin text-white' />
                ) : (
                  <span>{unreadCount}</span>
                )}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-90 p-0'
        >
          <div className='bg-muted/50 flex items-center justify-between border-b px-4 py-2'>
            <span className='text-primary font-medium'>
              <div className='flex items-center gap-2'>
                <BellRing className='h-4 w-4' />
                Notifications
              </div>
            </span>

            {notifications.length > 0 && unreadCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                className='hover:bg-accent h-7 px-2 text-xs'
                onClick={markAllAsRead}
                disabled={isMarkingAllRead}
              >
                {isMarkingAllRead ? (
                  <LoadingSpinner className='h-3 w-3 animate-spin' />
                ) : (
                  <CheckCheck className='h-3 w-3' />
                )}
                Mark all read
              </Button>
            )}
          </div>

          {notifications.length > 0 ? (
            notifications.map((notification, _index) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn('focus:bg-accent p-0', 'cursor-pointer')}
                onClick={() => clickNotification(notification.assetId.toString(), notification.id.toString())}
              >
                <div
                  className={cn(
                    'w-full p-3 transition-colors',
                    'border-b last:border-b-0',
                    notification.status === 'pending' && 'bg-accent/30'
                  )}
                >
                  <div className='flex items-start gap-2'>
                    <div className='mt-0.5 flex-shrink-0'>{getNotificationIcon(notification.content)}</div>
                    <div className='flex-1'>
                      <p className={cn('text-sm', notification.status === 'pending' && 'font-medium')}>
                        {notification.content}
                      </p>
                      <span className='text-muted-foreground text-xs'>
                        {new Date(notification.notifyDate).toLocaleDateString()}
                      </span>
                    </div>
                    {notification.status === 'pending' && (
                      <div className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500' />
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className='text-muted-foreground p-4 text-center text-sm'>No notifications</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default NumberNotification
