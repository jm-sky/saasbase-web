import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { ITenant } from '../types/tenant.type'
import { tenantService } from '../services/TenantService'
import { useTenantStore } from '../store/tenant.store'

export const useTenant = () => {
  const tenantStore = useTenantStore()

  const tenantId = computed(() => tenantStore.tenantId ?? '')
  const { tenant } = storeToRefs(tenantStore)

  const loadTenant = async () => {
    tenant.value ??= await tenantService.get(tenantId.value)
  }

  const tenantProxy = computed({
    get() {
      if (!tenant.value) void loadTenant()
      return tenant.value
    },
    set(value: ITenant) {
      tenant.value = value
    }
  })

  return {
    tenant: tenantProxy,
    loadTenant,
  }
}