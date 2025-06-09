<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
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
import type { IVatRate } from '../types/vatRate.type'
import { vatRateService } from '../services/vatRate.service'
import { useVatRateStore } from '../stores/vatRate.store'

const { t } = useI18n()
const vatRateStore = useVatRateStore()
const { vatRates } = storeToRefs(vatRateStore)

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IVatRate | undefined>('modelValue', { required: true })

defineProps<{
  popoverContentClass?: string
  disabled?: boolean
}>()

const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const loadVatRates = async () => {
  try {
    loading.value = true
    error.value = null
    vatRates.value = await vatRateService.index()
  } catch (err) {
    error.value = 'Failed to load vat rates'
    console.error('[VatRatePicker][loadVatRates] error:', err)
  } finally {
    loading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedVatRate = vatRates.value.find((rate) => rate.id === selectedId)
  id.value = selectedVatRate?.id
  modelValue.value = selectedVatRate
  open.value = false
}

onMounted(() => {
  if (vatRates.value.length === 0) {
    void loadVatRates()
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
        {{ modelValue?.name ?? t('shared.vatRate.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.vatRate.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.vatRate.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="vatRate in vatRates"
              :key="vatRate.id"
              :value="vatRate.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.id === vatRate.id ? 'opacity-100' : 'opacity-0'"
              />
              {{ vatRate.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
