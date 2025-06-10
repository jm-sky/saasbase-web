<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
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
import { cn } from '@/lib/utils'
import type { IContractor } from '../types/contractor.type'
import { contractorService, type IContractorFilters } from '../services/ContractorService'
import type { FilterDefinition } from '@/domains/shared/types/resource.type'

const { t } = useI18n()

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IContractor | undefined>('modelValue', { required: true })

const { popoverContentClass, disabled, type = 'buyer' } = defineProps<{
  popoverContentClass?: string
  disabled?: boolean
  type?: 'supplier' | 'buyer'
}>()

const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const contractors = ref<IContractor[]>([])

const filters = computed<IContractorFilters>(() => {
  const filterData: Record<string, FilterDefinition> = {}

  if (type === 'supplier') {
    filterData.isSupplier = { value: true }
  }

  if (type === 'buyer') {
    filterData.isBuyer = { value: true }
  }

  return filterData
})

const loadContractors = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await contractorService.index(filters.value)
    contractors.value = response.data
  } catch (err) {
    error.value = 'Failed to load contractors'
    console.error('[ContractorPicker][loadContractors] error:', err)
  } finally {
    loading.value = false
  }
}

const filteredContractors = computed(() => {
  return contractors.value
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedContractor = contractors.value.find((contractor) => contractor.id === selectedId)
  id.value = selectedContractor?.id
  modelValue.value = selectedContractor
  open.value = false
}

onMounted(() => {
  if (contractors.value.length === 0) {
    void loadContractors()
  }
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
        {{ modelValue?.name ?? t('shared.contractor.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.contractor.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.contractor.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="contractor in filteredContractors"
              :key="contractor.id"
              :value="contractor.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.id === contractor.id ? 'opacity-100' : 'opacity-0'"
              />
              <div class="grid grid-cols-2 w-full gap-x-3">
                <div class="text-sm">
                  {{ contractor.name }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ t('contractor.fields.vatId') }}: {{ contractor.vatId }}
                </div>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
