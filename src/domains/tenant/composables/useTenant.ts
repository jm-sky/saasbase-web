import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { ITenant, ITenantAddress } from '../types/tenant.type'
import { tenantAddressesService } from '../services/TenantAddressesService'
import { tenantService } from '../services/TenantService'
import { useTenantStore } from '../store/tenant.store'

export const useTenant = () => {
  const tenantStore = useTenantStore()

  const tenantId = computed(() => tenantStore.tenantId ?? '')
  const { tenant, tenantBillingAddress } = storeToRefs(tenantStore)

  const loadTenant = async (): Promise<ITenant> => {
    tenant.value ??= await tenantService.get(tenantId.value)
    return tenant.value
  }

  const loadTenantBillingAddress = async (): Promise<ITenantAddress | null> => {
    const response = await tenantAddressesService.index(tenantId.value)
    tenantBillingAddress.value = response.data.find(address => address.isDefault) ?? response.data[0]
    return tenantBillingAddress.value
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
    tenantId,
    tenant: tenantProxy,
    tenantBillingAddress,
    loadTenant,
    loadTenantBillingAddress,
  }
}
