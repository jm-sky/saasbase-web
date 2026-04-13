<script setup lang="ts">
import { useDebounceFn, useInfiniteScroll } from '@vueuse/core'
import { Plus } from 'lucide-vue-next'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import {
  PickerActions,
  PickerContent,
  PickerItem,
  PickerList,
  PickerPopover
} from '@/components/Pickers'
import Button from '@/components/ui/button/Button.vue'
import { CommandEmpty, CommandGroup } from '@/components/ui/command'
import { config } from '@/config'
import TagList from '@/domains/tags/components/TagList.vue'
import { useCache } from '@/lib/cache'
import type { IContractorLookup } from '../types/contractor.type'
import { contractorService, type IContractorFilters } from '../services/ContractorService'
import type { FilterDefinition } from '@/domains/shared/types/resource.type'

const { t } = useI18n()

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IContractorLookup | undefined>('modelValue', { required: true })

const {
  popoverContentClass,
  disabled,
  class: classProp,
  type = 'buyer',
  showCreateButton,
  showVatId,
  perPage = 20,
  maxHeight = '300px'
} = defineProps<{
  class?: string
  popoverContentClass?: string
  disabled?: boolean
  type?: 'supplier' | 'buyer'
  showCreateButton?: boolean
  showVatId?: boolean
  perPage?: number
  maxHeight?: string
}>()

const emit = defineEmits<{
  create: []
  error: [error: Error]
}>()

const open = ref(false)
const search = ref('')
const contractors = ref<IContractorLookup[]>([])
const currentPage = ref(1)
const hasMoreData = ref(true)
const error = ref<string | null>(null)
const listRef = useTemplateRef<HTMLElement>('listRef')
const recentSelections = ref<IContractorLookup[]>([])

// Load recent selections from localStorage
const loadRecentSelections = () => {
  try {
    const stored = localStorage.getItem(`${config.appId}:contractor-recent-${type}`)
    if (stored) {
      recentSelections.value = JSON.parse(stored).slice(0, 3) // Keep last 3
    }
  } catch {
    // Ignore localStorage errors
  }
}

// Save to recent selections
const saveToRecent = (contractor: IContractorLookup) => {
  const filtered = recentSelections.value.filter(c => c.id !== contractor.id)
  recentSelections.value = [contractor, ...filtered].slice(0, 3)

  try {
    localStorage.setItem(`${config.appId}:contractor-recent-${type}`, JSON.stringify(recentSelections.value))
  } catch {
    // Ignore localStorage errors
  }
}

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
    page: currentPage.value,
    perPage,
  }
})

const showResults = (items: IContractorLookup[], isNewSearch = false) => {
  if (isNewSearch) {
    contractors.value = items
    currentPage.value = 1
  } else {
    contractors.value = [...contractors.value, ...items]
  }

  hasMoreData.value = items.length === perPage
  error.value = null
}

const { loading, clearCache, searchWithCache } = useCache<IContractorFilters, IContractorLookup>({
  softRefreshInterval: 5 * 60 * 1000, // 5 minutes
  loadItems: (filters) => contractorService.lookup(filters),
  showResults: (items) => {
    showResults(items, filters.value.page === 1)
  },
})

const groupedContractors = computed(() => {
  if (!search.value && recentSelections.value.length > 0) {
    const recentIds = new Set(recentSelections.value.map(c => c.id))
    const otherContractors = contractors.value.filter(c => !recentIds.has(c.id))

    return {
      recent: recentSelections.value,
      others: otherContractors
    }
  }

  return {
    recent: [],
    others: contractors.value
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedContractor = [...contractors.value, ...recentSelections.value]
    .find((contractor) => contractor.id === selectedId)

  if (selectedContractor) {
    id.value = selectedContractor.id
    modelValue.value = selectedContractor
    saveToRecent(selectedContractor)
    open.value = false
  }
}

const loadMore = async () => {
  if (loading.value || !hasMoreData.value) return

  currentPage.value += 1
  await searchWithCache(filters.value)
}

// Infinite scroll setup
useInfiniteScroll(
  listRef,
  loadMore,
  { distance: 10 }
)

const onSearchDebounced = useDebounceFn(async (value: string) => {
  currentPage.value = 1
  hasMoreData.value = true
  await searchWithCache({ ...filters.value, search: value, page: 1 })
}, 300)

const resetSearch = () => {
  search.value = ''
  currentPage.value = 1
  contractors.value = []
  hasMoreData.value = true
  error.value = null
}

const cleanCacheAndSearch = () => {
  clearCache()
  resetSearch()
  void searchWithCache(filters.value)
}

// Watch for search changes
watch(search, (newValue) => {
  if (!newValue) {
    resetSearch()
    void searchWithCache(filters.value)
  }
})

// Watch for open state changes
watch(open, (isOpen) => {
  if (isOpen) {
    void nextTick(() => {
      if (contractors.value.length === 0) {
        void searchWithCache(filters.value)
      }
    })
  } else {
    // Reset search when closing
    search.value = ''
  }
})

onMounted(() => {
  loadRecentSelections()
  if (contractors.value.length === 0) {
    void searchWithCache(filters.value)
  }
})
</script>

<template>
  <PickerPopover
    v-model:open="open"
    :disabled="disabled || loading"
    :class="classProp"
    :popover-content-class="popoverContentClass"
  >
    <template #trigger>
      <slot name="trigger">
        <span class="truncate">
          {{ modelValue?.name ?? t('shared.contractor.select') }}
        </span>
      </slot>
    </template>

    <PickerContent
      v-model:search="search"
      :search-placeholder="t('shared.contractor.search')"
      :error="error"
      @search-input="onSearchDebounced"
    />

    <PickerList ref="listRef" :max-height="maxHeight">
      <CommandEmpty>
        <div class="text-center py-4">
          <p>{{ t('shared.contractor.notFound') }}</p>
          <Button
            v-if="showCreateButton"
            variant="outline"
            size="sm"
            class="mt-2"
            @click="emit('create')"
          >
            <Plus class="mr-2 h-4 w-4" />
            {{ t('shared.contractor.create') }}
          </Button>
        </div>
      </CommandEmpty>

      <!-- Recent Selections -->
      <CommandGroup v-if="groupedContractors.recent.length > 0" :heading="t('shared.contractor.recent')">
        <PickerItem
          v-for="contractor in groupedContractors.recent"
          :key="`recent-${contractor.id}`"
          :value="contractor.id"
          :selected="modelValue?.id === contractor.id"
          :disabled="loading"
          @select="onSelect"
        >
          <div class="flex flex-col w-full min-w-0">
            <div class="text-sm font-medium truncate">
              {{ contractor.name }}
            </div>
            <div v-if="showVatId && contractor.vatId" class="text-xs text-muted-foreground truncate">
              {{ t('contractor.fields.vatId') }}: {{ contractor.vatId }}
            </div>
          </div>
        </PickerItem>
      </CommandGroup>

      <!-- All Contractors -->
      <CommandGroup :heading="groupedContractors.recent.length > 0 ? t('shared.contractor.all') : undefined">
        <PickerItem
          v-for="contractor in groupedContractors.others"
          :key="contractor.id"
          :value="contractor.id"
          :selected="modelValue?.id === contractor.id"
          :disabled="loading"
          @select="onSelect"
        >
          <div class="flex flex-col w-full min-w-0">
            <div class="text-sm truncate">
              {{ contractor.name }}
            </div>
            <div v-if="showVatId && contractor.vatId" class="text-xs text-muted-foreground truncate">
              {{ t('contractor.fields.vatId') }}: {{ contractor.vatId }}
            </div>
            <div v-if="contractor.tags.length > 0" class="text-xs text-muted-foreground truncate">
              <TagList :tags="contractor.tags" />
            </div>
          </div>
        </PickerItem>

        <!-- Load More Indicator -->
        <div v-if="hasMoreData && !loading" class="p-2 text-center">
          <div class="text-xs text-muted-foreground">
            {{ t('shared.contractor.scrollForMore') }}
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading" class="flex justify-center items-center p-4">
          <LoadingIcon class="size-4 animate-spin mr-2" />
          <span class="text-sm text-muted-foreground">
            {{ t('common.loading') }}
          </span>
        </div>
      </CommandGroup>
    </PickerList>

    <PickerActions>
      <Button variant="outline" size="sm" @click="cleanCacheAndSearch()">
        {{ t('common.clearCache', 'Clear cache') }}
      </Button>
      <Button
        v-if="showCreateButton"
        variant="outline"
        size="sm"
        @click="emit('create')"
      >
        <Plus class="mr-2 h-4 w-4" />
        {{ t('shared.contractor.create') }}
      </Button>
    </PickerActions>
  </PickerPopover>
</template>

<style scoped>
/* No custom scrollbar styles needed - handled by PickerList */
</style>
