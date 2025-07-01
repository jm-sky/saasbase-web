<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
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
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { cn } from '@/lib/utils'
import type { IExchangeRate, IExchangeRateFilters } from '../types/exchange-rate.type'
import { exchangeRateService } from '../services/ExchangeRate.service'
import { useExchangeRateStore } from '../stores/exchangeRate.store'

const { t } = useI18n()
const exchangeRateStore = useExchangeRateStore()
const { rates, loading } = storeToRefs(exchangeRateStore)

const id = defineModel<string | undefined>('id')
const rate = defineModel<number | undefined>('rate')

const exchangeRateValue = ref<IExchangeRate | undefined>(undefined)

const props = defineProps<{
  date: string | undefined
  popoverContentClass?: string
  disabled?: boolean
}>()

const open = ref(false)

// Format display text for selected exchange rate
const selectedText = computed(() => {
  if (!exchangeRateValue.value) {
    return t('shared.exchangeRate.select')
  }

  const rate = exchangeRateValue.value
  return `${rate.table} | ${rate.rate} | ${rate.date}`
})

// Load exchange rates for the specified date
const loadExchangeRates = async (date: string) => {
  const filters: IExchangeRateFilters = {
    filter: {
      date: { value: date }
    }
  }

  // Try to load from cache first
  if (exchangeRateStore.loadFromCache(filters)) {
    return
  }

  try {
    exchangeRateStore.setLoading(true)
    const result = await exchangeRateService.index(filters)
    exchangeRateStore.setRates(result.data)
    exchangeRateStore.saveToCache(filters)
  } catch (err) {
    handleErrorWithToast(t('shared.exchangeRate.loadError'), err)
    console.error('[ExchangeRatePicker][loadExchangeRates] error:', err)
  } finally {
    exchangeRateStore.setLoading(false)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedRate = rates.value.find((rate) => rate.id === selectedId)
  id.value = selectedRate?.id
  exchangeRateValue.value = selectedRate
  rate.value = selectedRate?.rate
  open.value = false
}

// Watch for date changes and reload rates
watch(
  () => props.date,
  (newDate) => {
    if (newDate) {
      void loadExchangeRates(newDate)
    } else {
      // Clear rates if no date is provided
      exchangeRateStore.setRates([])
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.date) {
    void loadExchangeRates(props.date)
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
        :disabled="disabled || loading || !date"
        class="w-full justify-between"
      >
        {{ selectedText }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.exchangeRate.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.exchangeRate.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="rateItem in rates"
              :key="rateItem.id"
              :value="rateItem.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="exchangeRateValue?.id === rateItem.id ? 'opacity-100' : 'opacity-0'"
              />
              <div class="flex w-full justify-between items-center">
                <span class="font-medium">{{ rateItem.table }}</span>
                <span class="text-sm text-muted-foreground">{{ rateItem.rate }}</span>
                <span class="text-xs text-muted-foreground">{{ rateItem.date }}</span>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
