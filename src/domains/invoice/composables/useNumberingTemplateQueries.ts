import { useQuery } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { numberingTemplateService } from '../services/NumberingTemplate.service'
import { numberingTemplateKeys } from './numberingTemplateQueryKeys'

export function useNumberingTemplateList() {
  const authStore = useAuthStore()
  const { tenantId } = storeToRefs(authStore)

  return useQuery({
    queryKey: computed(() => numberingTemplateKeys.list(tenantId.value)),
    queryFn: () => numberingTemplateService.index(),
    enabled: computed(() => !!tenantId.value),
  })
}
