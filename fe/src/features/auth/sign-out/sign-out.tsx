import { useTransition } from 'react'
import { signOut } from '../api'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '@/components'
import { LogOut } from 'lucide-react'
import { tryCatch } from '@/utils'

const SignOut = () => {
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const handleSignOut = () => {
    startTransition(async () => {
      const response = await tryCatch(signOut())
      if (response.error) {
        toast.error('Sign out failed')
      }
      toast.success('Sign out successfully')
      Object.keys(Cookies.get()).forEach(function (cookieName) {
        Cookies.remove(cookieName)
      })
      navigate('/login')
    })
  }
  return (
    <div
      onClick={handleSignOut}
      className='flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm'
    >
      <LogOut />
      {isPending ? <LoadingSpinner className='' /> : 'Sign Out'}
    </div>
  )
}

export default SignOut
