<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { type HTMLAttributes, onMounted, ref } from 'vue'
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
import type { ICurrency } from '../types/currency.type'
import { currencyService } from '../services/Currency.service'
import { useCurrencyStore } from '../stores/currency.store'

const { t } = useI18n()
const currencyStore = useCurrencyStore()
const { currencies } = storeToRefs(currencyStore)

const id = defineModel<string | null | undefined>('id')
const modelValue = defineModel<ICurrency | undefined>('modelValue')

const props = defineProps<{
  class?: HTMLAttributes['class']
  popoverContentClass?: string
  disabled?: boolean
}>()

const open = ref(false)
const loading = ref(false)

const loadCurrencies = async () => {
  try {
    loading.value = true
    currencies.value = await currencyService.index()
  } catch (err) {
    handleErrorWithToast(t('shared.currency.loadError'), err)
    console.error('[CurrencyPicker][loadCurrencies] error:', err)
  } finally {
    loading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedCurrency = currencies.value.find((currency) => currency.code === selectedId)
  id.value = selectedCurrency?.code
  modelValue.value = selectedCurrency
  open.value = false
}

onMounted(() => {
  if (currencies.value.length === 0) {
    void loadCurrencies()
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
        :class="props.class"
      >
        {{ modelValue?.code ?? t('shared.currency.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.currency.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.currency.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="currency in currencies"
              :key="currency.code"
              :value="currency.code"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.code === currency.code ? 'opacity-100' : 'opacity-0'"
              />
              {{ currency.code }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
