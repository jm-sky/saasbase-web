import { isAxiosError } from 'axios'
import { useToast } from '@/components/ui/toast'

export const handleErrorWithToast = (message: string, error: unknown) => {
  const { toast } = useToast()

  toast.error(message, {
    description: isAxiosError(error) ? error.response?.data.message : 'Unknown error',
  })
}