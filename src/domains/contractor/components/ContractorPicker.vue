<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import CommandSeparator from '@/components/ui/command/CommandSeparator.vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCache } from '@/lib/cache'
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
const search = ref('')
const contractors = ref<IContractor[]>([])

const filters = computed<IContractorFilters>(() => {
  const filterData: Record<string, FilterDefinition> = {}

  if (type === 'supplier') {
    filterData.isSupplier = { value: true }
  }

  if (type === 'buyer') {
    filterData.isBuyer = { value: true }
  }

  return {
    search: search.value,
    filter: filterData,
    page: 1,
    perPage: 10,
  }
})

const showResults = (items: IContractor[]) => {
  contractors.value = items
}

const { loading, clearCache, searchWithCache } = useCache<IContractorFilters, IContractor>({
  softRefreshInterval: 5 * 60 * 1000, // 5 minut
  loadItems: (filters) => contractorService.index(filters),
  showResults,
})

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

const onSearchDebounced = useDebounceFn((value: string) => {
  void searchWithCache({ ...filters.value, search: value })
}, 300)

onMounted(() => {
  if (contractors.value.length === 0) {
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
        class="w-full justify-between"
      >
        {{ modelValue?.name ?? t('shared.contractor.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput v-model="search" :placeholder="t('shared.contractor.search')" @input="(event) => onSearchDebounced(event.target.value)" />
        <CommandList>
          <CommandEmpty>{{ t('shared.contractor.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="contractor in filteredContractors"
              :key="contractor.id"
              :value="contractor.id"
              :class="loading ? 'opacity-50' : ''"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.id === contractor.id ? 'opacity-100' : 'opacity-0'"
              />
              <div class="flex flex-row justify-between items-center w-full gap-x-3">
                <div class="text-sm">
                  {{ contractor.name }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ t('contractor.fields.vatId') }}: {{ contractor.vatId }}
                </div>
              </div>
            </CommandItem>
            <div v-if="loading" class="absolute top-0 left-0 w-full h-full flex justify-center items-center p-2">
              <LoadingIcon class="size-4 animate-spin" />
            </div>
            <CommandSeparator />
            <div class="p-2">
              <Button variant="outline" @click="clearCache()">
                {{ t('common.clearCache', 'Clear cache') }}
              </Button>
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
