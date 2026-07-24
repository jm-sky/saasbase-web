<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
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
import { useCache } from '@/lib/cache'
import { cn } from '@/lib/utils'
import { countryService, type ICountryFilters } from '../services/Country.service'
import type { ICountry } from '../types/country.type'

const { t } = useI18n()

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<ICountry | undefined>('modelValue')

const props = defineProps<{
  popoverContentClass?: string
  disabled?: boolean
  placeholder?: string
  class?: string
  showName?: boolean
}>()

const open = ref(false)
const search = ref('')
const countries = ref<ICountry[]>([
  {
    'name': 'Poland',
    'code': 'PL',
    'code3': 'POL',
    'numericCode': '616',
    'phoneCode': '+48',
    'capital': 'Warsaw',
    'currencyCode': 'PLN',
    'currencySymbol': 'zł',
    'tld': '.pl',
    'native': 'Polska',
    'region': 'Europe',
    'subregion': 'Central Europe',
    'emoji': '🇵🇱',
  }
])

const filters = computed<ICountryFilters>(() => ({
  search: search.value,
  filter: {},
  page: 1,
  perPage: 50,
}))

const showResults = (items: ICountry[]) => {
  countries.value = items
}

const { loading, searchWithCache } = useCache<ICountryFilters, ICountry>({
  softRefreshInterval: 30 * 60 * 1000, // 30 minutes
  loadItems: (filters) => countryService.index(filters),
  showResults,
})

const filteredCountries = computed(() => {
  return countries.value
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedCode = event.detail.value
  const selectedCountry = countries.value.find((country) => country.code === selectedCode)
  id.value = selectedCountry?.code
  modelValue.value = selectedCountry
  open.value = false
}

const onSearchDebounced = useDebounceFn((value: string) => {
  void searchWithCache({ ...filters.value, search: value })
}, 300)

onMounted(() => {
  if (countries.value.length === 0) {
    void searchWithCache(filters.value)
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
        :class="cn('w-full justify-between', props.class)"
      >
        <template v-if="showName">
          {{ modelValue?.name ?? placeholder ?? t('shared.country.select') }}
        </template>
        <template v-else>
          {{ id ?? placeholder ?? t('shared.country.select') }}
        </template>
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput v-model="search" :placeholder="t('shared.country.search')" @input="(event: Event) => onSearchDebounced((event.target as HTMLInputElement).value)" />
        <CommandList>
          <CommandEmpty>{{ t('shared.country.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="country in filteredCountries"
              :key="country.code"
              :value="country.code"
              :class="loading ? 'opacity-50' : ''"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.code === country.code ? 'opacity-100' : 'opacity-0'"
              />
              <div class="flex items-center gap-x-2">
                <div class="font-medium">
                  {{ country.code }}
                </div>
                <div class="text-muted-foreground">
                  {{ country.name }}
                </div>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
