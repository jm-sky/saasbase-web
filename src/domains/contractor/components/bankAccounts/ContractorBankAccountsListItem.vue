<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CopyToClipboard from '@/components/CopyToClipboard.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { contractorBankAccountsService } from '@/domains/contractor/services/ContractorBankAccountsService'
import { formatIBAN } from '@/lib/formatIBAN'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IContractorBankAccount } from '@/domains/contractor/models/contractor.model'

const { t } = useI18n()

const { contractorId, bankAccount } = defineProps<{
  contractorId: string
  bankAccount: IContractorBankAccount
}>()

const emit = defineEmits<{
  setDefault: [bankAccount: IContractorBankAccount]
  edit: [bankAccount: IContractorBankAccount]
  delete: [bankAccount: IContractorBankAccount]
  deleted: [bankAccount: IContractorBankAccount]
}>()

const isDeleting = ref(false)

const handleDelete = async () => {
  try {
    if (!confirm(t('bankAccounts.delete.confirmation'))) return
    isDeleting.value = true
    emit('delete', bankAccount)
    await contractorBankAccountsService.delete(contractorId, bankAccount.id)
    emit('deleted', bankAccount)
  } catch (error) {
    handleErrorWithToast(t('bankAccounts.delete.error'), error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div
    class="border rounded-md px-3 py-2 grid md:grid-cols-[1fr_1fr_auto] items-center gap-x-3 gap-y-1"
    :class="{ 'border-primary/50': bankAccount.isDefault, 'pointer-events-none opacity-50': isDeleting }"
  >
    <div class="flex flex-row gap-2 items-center order-1 max-w-full overflow-hidden">
      <Icon icon="lucide:banknote" :class="bankAccount.isDefault ? 'text-primary' : 'text-muted-foreground'" />
      <span class="truncate">
        {{ formatIBAN(bankAccount.iban) }}
      </span>
      <CopyToClipboard :text="formatIBAN(bankAccount.iban)" class="ml-1" />
    </div>

    <div class="text-sm text-muted-foreground order-2">
      <span v-if="bankAccount.currency" class="bg-muted-foreground/10 px-2 rounded">{{ bankAccount.currency }}</span>
    </div>

    <div class="flex flex-row gap-1 justify-end order-4 md:order-3">
      <Button
        v-tooltip="t('bankAccounts.setDefault')"
        variant="ghost"
        class="size-8 text-muted-foreground"
        @click="emit('setDefault', bankAccount)"
      >
        <Icon icon="lucide:star" :class="{ '[&>path]:fill-current' : bankAccount.isDefault}" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="size-8">
            <Icon icon="lucide:more-horizontal" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            class="cursor-pointer gap-2 hover:bg-accent"
            @click="emit('edit', bankAccount)"
          >
            <Icon icon="lucide:edit" />
            {{ t('common.edit') }}
          </DropdownMenuItem>
          <DropdownMenuItem
            class="cursor-pointer gap-2 hover:bg-accent"
            @click="handleDelete"
          >
            <Icon icon="lucide:trash" />
            {{ t('common.delete') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div v-if="bankAccount.description" class="col-span-full text-sm text-muted-foreground order-3 md:order-4">
      {{ bankAccount.description }}
    </div>
  </div>
</template>
