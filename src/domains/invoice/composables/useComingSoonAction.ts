import { useI18n } from 'vue-i18n'
import { useToast } from '@/components/ui/toast'

/**
 * Several invoice actions have UI (button/menu item, sometimes a whole
 * options dropdown) with no backing feature at all -- no service method, no
 * backend route. They used to fake success with a setTimeout + success
 * toast, which actively misleads the user into believing the action
 * happened (e.g. "email sent", "reminder scheduled") when nothing did.
 * This is the honest replacement: say the feature isn't available yet.
 */
export const useComingSoonAction = () => {
  const { t } = useI18n()
  const { toast } = useToast()

  const notifyComingSoon = () => {
    toast.info(t('common.feature.commingSoon'))
  }

  return { notifyComingSoon }
}
