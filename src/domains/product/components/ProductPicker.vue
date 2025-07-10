<script setup lang="ts">
import { templateRef, useDebounceFn, useInfiniteScroll } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import {
  PickerActions,
  PickerContent,
  PickerItem,
  PickerList,
  PickerPopover
} from '@/components/Pickers'
import { CommandGroup } from '@/components/ui/command'
import { config } from '@/config'
import TagList from '@/domains/tags/components/TagList.vue'
import { useCache } from '@/lib/cache'
import type { IProductLookup } from '../types/product.type'
import { type IProductFilters, productService } from '../services/ProductService'
import type { FilterDefinition } from '@/domains/shared/types/resource.type'

const { t } = useI18n()

const id = defineModel<string | null | undefined>('id')
const modelValue = defineModel<IProductLookup | undefined>('modelValue')

const {
  popoverContentClass,
  disabled,
  class: classProp,
  type = undefined,
  showCreateButton = false,
  showPrice = true,
  perPage = 20,
  maxHeight = '300px'
} = defineProps<{
  class?: string
  popoverContentClass?: string
  disabled?: boolean
  type?: 'product' | 'service'
  showCreateButton?: boolean
  showPrice?: boolean
  perPage?: number
  maxHeight?: string
}>()

const emit = defineEmits<{
  create: []
  error: [error: Error]
}>()

const open = ref(false)
const search = ref('')
const products = ref<IProductLookup[]>([])
const currentPage = ref(1)
const hasMoreData = ref(true)
const error = ref<string | null>(null)
const listRef = templateRef<HTMLElement>('listRef')
const recentSelections = ref<IProductLookup[]>([])

const cacheKey = computed(() => `${config.appId}:product-recent-${type ?? 'all'}`)

// Load recent selections from localStorage
const loadRecentSelections = () => {
  try {
    const stored = localStorage.getItem(cacheKey.value)
    if (stored) {
      recentSelections.value = JSON.parse(stored).slice(0, 3) // Keep last 3
    }
  } catch {
    // Ignore localStorage errors
  }
}

// Save to recent selections
const saveToRecent = (product: IProductLookup) => {
  const filtered = recentSelections.value.filter(p => p.id !== product.id)
  recentSelections.value = [product, ...filtered].slice(0, 3)

  try {
    localStorage.setItem(cacheKey.value, JSON.stringify(recentSelections.value))
  } catch {
    // Ignore localStorage errors
  }
}

const clearRecentSelections = () => {
  recentSelections.value = []
  localStorage.removeItem(cacheKey.value)
}

const filters = computed<IProductFilters>(() => {
  const filterData: Record<string, FilterDefinition> = {}

  if (type === 'product') {
    filterData.type = { value: 'product' }
  }

  if (type === 'service') {
    filterData.type = { value: 'service' }
  }

  return {
    search: search.value,
    filter: filterData,
    page: currentPage.value,
    perPage,
  }
})

const showResults = (items: IProductLookup[], isNewSearch = false) => {
  if (isNewSearch) {
    products.value = items
    currentPage.value = 1
  } else {
    products.value = [...products.value, ...items]
  }

  hasMoreData.value = items.length === perPage
  error.value = null
}

const { loading, clearCache, searchWithCache } = useCache<IProductFilters, IProductLookup>({
  softRefreshInterval: 5 * 60 * 1000, // 5 minutes
  loadItems: (filters) => productService.lookup(filters),
  showResults: (items) => {
    showResults(items, filters.value.page === 1)
  },
})

const groupedProducts = computed(() => {
  if (!search.value && recentSelections.value.length > 0) {
    const recentIds = new Set(recentSelections.value.map(p => p.id))
    const otherProducts = products.value.filter(p => !recentIds.has(p.id))

    return {
      recent: recentSelections.value,
      others: otherProducts
    }
  }

  return {
    recent: [],
    others: products.value
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedProduct = [...products.value, ...recentSelections.value]
    .find((product) => product.id === selectedId)

  if (selectedProduct) {
    id.value = selectedProduct.id
    modelValue.value = selectedProduct
    saveToRecent(selectedProduct)
    open.value = false
  }
}

const loadMore = async () => {
  if (loading.value || !hasMoreData.value || error.value) return

  currentPage.value += 1
  try {
    await searchWithCache(filters.value)
  } catch (err) {
    console.error('ProductPicker loadMore error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load more products'
    hasMoreData.value = false // Stop infinite scroll on error
    emit('error', err instanceof Error ? err : new Error('Failed to load more products'))
  }
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
  error.value = null // Clear previous errors
  try {
    await searchWithCache({ ...filters.value, search: value, page: 1 })
  } catch (err) {
    console.error('ProductPicker search error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to search products'
    hasMoreData.value = false
    emit('error', err instanceof Error ? err : new Error('Failed to search products'))
  }
}, 300)

const resetSearch = () => {
  search.value = ''
  currentPage.value = 1
  products.value = []
  hasMoreData.value = true
  error.value = null
}

const cleanCacheAndSearch = () => {
  console.log('cleanCacheAndSearch')
  loading.value = true
  clearCache()
  resetSearch()
  clearRecentSelections()
  void searchWithCache(filters.value, true).catch((err: unknown) => {
    console.error('ProductPicker cleanCacheAndSearch error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load products'
    hasMoreData.value = false
    emit('error', err instanceof Error ? err : new Error('Failed to load products'))
  })
}

// Watch for search changes
watch(search, (newValue) => {
  if (!newValue) {
    resetSearch()
    void searchWithCache(filters.value).catch((err: unknown) => {
      console.error('ProductPicker search watch error:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load products'
      hasMoreData.value = false
      emit('error', err instanceof Error ? err : new Error('Failed to load products'))
    })
  }
})

// Watch for open state changes
watch(open, (isOpen) => {
  if (isOpen) {
    void nextTick(() => {
      if (products.value.length === 0) {
        void searchWithCache(filters.value).catch((err: unknown) => {
          console.error('ProductPicker open watch error:', err)
          error.value = err instanceof Error ? err.message : 'Failed to load products'
          hasMoreData.value = false
          emit('error', err instanceof Error ? err : new Error('Failed to load products'))
        })
      }
    })
  } else {
    // Reset search when closing
    search.value = ''
  }
})

onMounted(() => {
  loadRecentSelections()
  if (products.value.length === 0) {
    void searchWithCache(filters.value).catch((err: unknown) => {
      console.error('ProductPicker onMounted error:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load products'
      hasMoreData.value = false
      emit('error', err instanceof Error ? err : new Error('Failed to load products'))
    })
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
          {{ modelValue?.name ?? t('shared.product.select') }}
        </span>
      </slot>
    </template>

    <PickerContent
      v-model:search="search"
      :search-placeholder="t('shared.product.search')"
      :error="error"
      @search-input="onSearchDebounced"
    />

    <PickerList
      ref="listRef"
      :max-height="maxHeight"
      :show-create-button="showCreateButton"
    >
      <!-- Recent Selections -->
      <CommandGroup v-if="groupedProducts.recent.length > 0" :heading="t('shared.product.recent')">
        <PickerItem
          v-for="product in groupedProducts.recent"
          :key="`recent-${product.id}`"
          :value="product.id"
          :selected="modelValue?.id === product.id"
          :disabled="loading"
          @select="onSelect"
        >
          <div class="flex flex-col w-full min-w-0">
            <div class="text-sm font-medium truncate">
              {{ product.name }}
            </div>
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <span class="capitalize">{{ product.type }}</span>
              <span v-if="showPrice && product.priceNet" class="font-medium">
                {{ product.priceNet }}
                <span v-if="product.unit">/ {{ product.unit.name }}</span>
              </span>
            </div>
          </div>
        </PickerItem>
      </CommandGroup>

      <!-- All Products -->
      <CommandGroup :heading="groupedProducts.recent.length > 0 ? t('shared.product.all') : undefined">
        <PickerItem
          v-for="product in groupedProducts.others"
          :key="product.id"
          :value="product.id"
          :selected="modelValue?.id === product.id"
          :disabled="loading"
          @select="onSelect"
        >
          <div class="flex flex-col w-full min-w-0">
            <div class="text-sm truncate">
              {{ product.name }}
            </div>
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <span class="capitalize">{{ product.type }}</span>
              <span v-if="showPrice && product.priceNet" class="font-medium">
                {{ product.priceNet }}
                <span v-if="product.unit">/ {{ product.unit.name }}</span>
              </span>
            </div>
            <div v-if="product.tags.length > 0" class="text-xs text-muted-foreground truncate">
              <TagList :tags="product.tags" />
            </div>
          </div>
        </PickerItem>

        <!-- Load More Indicator -->
        <div v-if="hasMoreData && !loading" class="p-2 text-center">
          <div class="text-xs text-muted-foreground">
            {{ t('shared.scrollForMore') }}
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

    <PickerActions
      :show-clear-cache="true"
      :show-create-button="showCreateButton"
      @clear-cache="cleanCacheAndSearch"
      @create="emit('create')"
    />
  </PickerPopover>
</template>
