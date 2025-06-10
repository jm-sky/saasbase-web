<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatIBAN } from '@/lib/formatIBAN'
import { cn } from '@/lib/utils'
import type { IContractorBankAccount } from '../types/contractor.type'
import { contractorBankAccountsService } from '../services/ContractorBankAccountsService'

const { t } = useI18n()

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IContractorBankAccount | undefined>('modelValue', { required: true })

const { popoverContentClass, disabled, contractorId } = defineProps<{
  popoverContentClass?: string
  disabled?: boolean
  contractorId?: string
}>()

const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const bankAccounts = ref<IContractorBankAccount[]>([])

const loadBankAccounts = async () => {
  if (!contractorId) return

  try {
    loading.value = true
    error.value = null
    const response = await contractorBankAccountsService.index(contractorId)
    bankAccounts.value = response.data
  } catch (err) {
    error.value = 'Failed to load bank accounts'
    console.error('[ContractorBankAccountPicker][loadBankAccounts] error:', err)
  } finally {
    loading.value = false
  }
}

const filteredBankAccounts = computed(() => {
  return bankAccounts.value
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedAccount = bankAccounts.value.find((account) => account.id === selectedId)
  id.value = selectedAccount?.id
  modelValue.value = selectedAccount
  open.value = false
}

watch(() => contractorId, () => {
  void loadBankAccounts()
}, {
  immediate: true,
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled || loading"
        class="w-full justify-between"
      >
        {{ modelValue ? `${modelValue.bankName} (${formatIBAN(modelValue.iban)})` : t('shared.bankAccount.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.bankAccount.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.bankAccount.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="account in filteredBankAccounts"
              :key="account.id"
              :value="account.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.id === account.id ? 'opacity-100' : 'opacity-0'"
              />
              <div class="grid grid-cols-2 w-full gap-x-2">
                <div class="text-sm">
                  {{ account.bankName }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ formatIBAN(account.iban) }}
                </div>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
