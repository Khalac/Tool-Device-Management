import * as React from 'react'
import { cn } from '@/lib/utils'

type InputProps = React.ComponentProps<'input'> & {
  highlightOnValue?: boolean
}

function Input({ className, type, value, onChange, highlightOnValue = true, ...props }: InputProps) {
  const [hasValue, setHasValue] = React.useState(!!value)

  React.useEffect(() => {
    setHasValue(!!value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value !== '')
    onChange?.(e)
  }

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-primary focus-visible:ring-primary/10 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        highlightOnValue && hasValue && 'border-primary ring-primary/10 ring-[3px]',
        className
      )}
      {...props}
    />
  )
}

export { Input }
