<script setup lang="ts">
import TenantAddressesList from '@/domains/tenant/components/addresses/TenantAddressesList.vue'
import TenantAttachmentsList from '@/domains/tenant/components/attachments/TenantAttachmentsList.vue'
import TenantBankAccountsList from '@/domains/tenant/components/bankAccounts/TenantBankAccountsList.vue'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

defineProps<{
  tenant?: ITenant
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <div class="font-bold">
      Description
    </div>
    <div class="text-muted-foreground">
      {{ tenant?.description }}
    </div>
  </div>

  <div class="border rounded-md p-2 shadow-lg/5">
    <TenantAddressesList />
  </div>

  <div class="border rounded-md p-2 shadow-lg/5">
    <TenantBankAccountsList />
  </div>

  <div class="border rounded-md p-2 shadow-lg/5">
    <TenantAttachmentsList />
  </div>
</template>
