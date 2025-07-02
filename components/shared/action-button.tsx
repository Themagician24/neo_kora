'use client'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function ActionButton({
  caption,
  action,
  className = 'w-full',
  variant = 'default',
  size = 'default',
}: {
  caption: string
  action: () => Promise<{ success: boolean; message: string }>
  className?: string
  variant?: 'default' | 'outline' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
}) {
  const [isPending, startTransition] = useTransition()
 
  return (
    <Button
      type='button'
      className={cn('rounded-full', className)}
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
  const res = await action()
  if (res.success) {
    toast(res.message) // toast par défaut (info)
    // ou toast.success(res.message) pour toast vert succès
  } else {
    toast.error(res.message) // toast rouge erreur
  }
})

      }
    >
      {isPending ? 'processing...' : caption}
    </Button>
  )
}
