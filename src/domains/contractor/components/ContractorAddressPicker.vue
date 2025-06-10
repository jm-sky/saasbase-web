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
import { fullAddress } from '@/lib/fullAddress'
import { cn } from '@/lib/utils'
import type { IContractorAddress } from '../types/contractor.type'
import { contractorAddressesService } from '../services/ContractorAddressesService'

const { t } = useI18n()

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IContractorAddress | undefined>('modelValue', { required: true })

const { popoverContentClass, disabled, contractorId } = defineProps<{
  popoverContentClass?: string
  disabled?: boolean
  contractorId?: string
}>()

const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const addresses = ref<IContractorAddress[]>([])

const loadAddresses = async () => {
  if (!contractorId) return

  try {
    loading.value = true
    error.value = null
    const response = await contractorAddressesService.index(contractorId)
    addresses.value = response.data
  } catch (err) {
    error.value = 'Failed to load addresses'
    console.error('[ContractorAddressPicker][loadAddresses] error:', err)
  } finally {
    loading.value = false
  }
}

const filteredAddresses = computed(() => {
  return addresses.value
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedAddress = addresses.value.find((address) => address.id === selectedId)
  id.value = selectedAddress?.id
  modelValue.value = selectedAddress
  open.value = false
}

watch(() => contractorId, () => {
  void loadAddresses()
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
        {{ modelValue ? fullAddress(modelValue) : t('shared.address.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.address.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.address.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="address in filteredAddresses"
              :key="address.id"
              :value="address.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.id === address.id ? 'opacity-100' : 'opacity-0'"
              />
              <div class="grid grid-cols-2 w-full gap-x-2">
                <div class="text-sm">
                  {{ t(`address.type.${address.type}`) }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ fullAddress(address) }}
                </div>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
