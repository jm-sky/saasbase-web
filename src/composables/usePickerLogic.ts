import { templateRef, useDebounceFn } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, type Ref, watch } from 'vue'
import { useCache } from '@/lib/cache'
import type { FilterDefinition } from '@/domains/shared/types/resource.type'
import type {
  BasePickerFilters,
  BasePickerItem,
  PickerConfig,
  UsePickerLogicReturn
} from '@/types/picker.types'

const DEBOUNCE_TIME = 300

export const usePickerLogic = <
  TItem extends BasePickerItem,
  TFilters extends BasePickerFilters
>(
  pickerConfig: PickerConfig<TItem, TFilters>,
  customFilters?: Record<string, unknown>
): UsePickerLogicReturn<TItem> => {

  const {
    service,
    storageKey,
    perPage = 20,
    softRefreshInterval = 5 * 60 * 1000, // 5 minutes
    maxRecentItems = 3,
    buildFilters
  } = pickerConfig

  // State
  const open = ref(false)
  const search = ref('')
  const items: Ref<TItem[]> = ref([])
  const currentPage = ref(1)
  const hasMoreData = ref(true)
  const error = ref<string | null>(null)
  const listRef = templateRef<HTMLElement>('listRef')
  const recentSelections: Ref<TItem[]> = ref([])

  // Load recent selections from localStorage
  const loadRecentSelections = () => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        recentSelections.value = JSON.parse(stored).slice(0, maxRecentItems)
      }
    } catch {
      // Ignore localStorage errors
      recentSelections.value = []
    }
  }

  // Save to recent selections
  const saveToRecent = (item: TItem) => {
    const filtered = recentSelections.value.filter(existing => existing.id !== item.id)
    recentSelections.value = [item, ...filtered].slice(0, maxRecentItems)

    try {
      localStorage.setItem(storageKey, JSON.stringify(recentSelections.value))
    } catch {
      // Ignore localStorage errors
    }
  }

  // Build filters for API calls
  const buildApiFilters = (searchValue: string, page: number): TFilters => {
    if (buildFilters) {
      return buildFilters(searchValue, page, perPage, customFilters)
    }

    // Default filter builder - this should be overridden in most cases
    return {
      search: searchValue,
      filter: (customFilters ?? {}) as Record<string, FilterDefinition>,
      page,
      perPage,
    } as TFilters
  }

  const filters = computed<TFilters>(() =>
    buildApiFilters(search.value, currentPage.value)
  )

  const showResults = (newItems: TItem[], isNewSearch = false) => {
    if (isNewSearch) {
      items.value = newItems
      currentPage.value = 1
    } else {
      items.value = [...items.value, ...newItems]
    }

    hasMoreData.value = newItems.length === perPage
    error.value = null
  }

  // Cache integration
  const { loading, clearCache, searchWithCache } = useCache<TFilters, TItem>({
    softRefreshInterval,
    loadItems: async (filters) => {
      return await service.lookup(filters)
    },
    showResults: (newItems) => {
      showResults(newItems, filters.value.page === 1)
    },
  })

  // Grouped items computation
  const groupedItems = computed(() => {
    if (!search.value && recentSelections.value.length > 0) {
      const recentIds = new Set(recentSelections.value.map(item => item.id))
      const otherItems = items.value.filter(item => !recentIds.has(item.id))

      return {
        recent: recentSelections.value,
        others: otherItems
      }
    }

    return {
      recent: [],
      others: items.value
    }
  })

  // Selection handler
  const onSelect = (selectedId: string): TItem | undefined => {
    const selectedItem = [...items.value, ...recentSelections.value]
      .find((item) => item.id === selectedId)

    if (selectedItem) {
      saveToRecent(selectedItem)
      open.value = false
      return selectedItem
    }
    return undefined
  }

  // Load more for infinite scroll
  const loadMore = async () => {
    if (loading.value || !hasMoreData.value) return

    currentPage.value += 1
    await searchWithCache(filters.value)
  }

  // Debounced search
  const onSearchDebounced = useDebounceFn(async (value: string) => {
    currentPage.value = 1
    hasMoreData.value = true
    await searchWithCache({ ...filters.value, search: value, page: 1 } as TFilters)
  }, DEBOUNCE_TIME)

  // Reset search state
  const resetSearch = () => {
    search.value = ''
    currentPage.value = 1
    items.value = []
    hasMoreData.value = true
    error.value = null
  }

  // Clear cache and search
  const handleClearCache = () => {
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
        if (items.value.length === 0) {
          void searchWithCache(filters.value)
        }
      })
    } else {
      // Reset search when closing
      search.value = ''
    }
  })

  // Initialize
  onMounted(() => {
    loadRecentSelections()
    if (items.value.length === 0) {
      void searchWithCache(filters.value)
    }
  })

  return {
    // State
    open,
    search,
    items,
    recentSelections,
    loading,
    error,
    hasMoreData,
    currentPage,

    // Computed
    groupedItems,

    // Methods
    onSelect,
    loadMore,
    clearCache: handleClearCache,
    resetSearch,
    onSearchDebounced: (value: string) => void onSearchDebounced(value),

    // Refs for infinite scroll
    listRef,
  }
}
