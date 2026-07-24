import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { tenantAddressesService } from '../services/TenantAddressesService'
import { tenantBankAccountsService } from '../services/TenantBankAccountsService'
import { tenantService } from '../services/TenantService'
import { useTenantStore } from '../store/tenant.store'
import type { ITenant, ITenantAddress, ITenantBankAccount } from '../types/tenant.type'

export const useTenant = () => {
  const tenantStore = useTenantStore()

  const tenantId = computed(() => tenantStore.tenantId ?? '')
  const { tenant, tenantBillingAddress, tenantBankAccounts } = storeToRefs(tenantStore)

  const loadTenant = async (): Promise<ITenant> => {
    tenant.value ??= await tenantService.get(tenantId.value)
    return tenant.value
  }

  const loadTenantBillingAddress = async (): Promise<ITenantAddress | null> => {
    const response = await tenantAddressesService.index(tenantId.value)
    tenantBillingAddress.value = response.data.find(address => address.isDefault) ?? response.data[0]
    return tenantBillingAddress.value
  }

  const loadTenantBankAccounts = async (): Promise<ITenantBankAccount[]> => {
    if (!tenantId.value) return []
    const response = await tenantBankAccountsService.index(tenantId.value)
    tenantBankAccounts.value = response.data
    return response.data
  }

  const loadTenantDefaultBankAccount = async (): Promise<ITenantBankAccount | null> => {
    const accounts = await loadTenantBankAccounts()
    return accounts.find(account => account.isDefault) ?? accounts[0]
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
    tenantBankAccounts,
    loadTenant,
    loadTenantBillingAddress,
    loadTenantBankAccounts,
    loadTenantDefaultBankAccount,
  }
}
