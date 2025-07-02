import type { FilterDefinition, IResourceCollection } from '@/domains/shared/types/resource.type'

// Base interface that all picker items must implement
export interface BasePickerItem {
  id: string
  name: string
  [key: string]: unknown
}

// Generic filters interface for API calls
export interface BasePickerFilters {
  search: string
  filter: Record<string, FilterDefinition>
  page: number
  perPage: number
}

// Service interface that picker services must implement (matches useCache expectations)
export interface PickerService<TItem extends BasePickerItem, TFilters extends BasePickerFilters> {
  lookup(filters: TFilters): Promise<IResourceCollection<TItem>>
}

// Configuration for picker behavior
export interface PickerConfig<TItem extends BasePickerItem, TFilters extends BasePickerFilters> {
  // Required
  service: PickerService<TItem, TFilters>
  storageKey: string // For recent selections

  // Optional with defaults
  perPage?: number
  maxHeight?: string
  softRefreshInterval?: number
  maxRecentItems?: number

  // UI configuration
  showCreateButton?: boolean
  showVatId?: boolean // For backward compatibility, will make this generic later

  // Custom filter builders
  buildFilters?: (searchValue: string, page: number, perPage: number, customFilters?: Record<string, unknown>) => TFilters
}

// Props interface for picker components
export interface PickerProps<TItem extends BasePickerItem> {
  modelValue?: TItem
  id?: string

  // UI props
  class?: string
  popoverContentClass?: string
  disabled?: boolean
  placeholder?: string

  // Behavior props
  showCreateButton?: boolean
  showVatId?: boolean
  perPage?: number
  maxHeight?: string
}

// Events interface for picker components
export interface PickerEvents<TItem extends BasePickerItem> {
  'update:modelValue': [value: TItem | undefined]
  'update:id': [value: string | undefined]
  create: []
  error: [error: Error]
}

// Composable return type
export interface UsePickerLogicReturn<TItem extends BasePickerItem> {
  // State
  open: Ref<boolean>
  search: Ref<string>
  items: Ref<TItem[]>
  recentSelections: Ref<TItem[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  hasMoreData: Ref<boolean>
  currentPage: Ref<number>

  // Computed
  groupedItems: ComputedRef<{
    recent: TItem[]
    others: TItem[]
  }>

  // Methods
  onSelect: (selectedId: string) => void
  loadMore: () => Promise<void>
  clearCache: () => void
  resetSearch: () => void
  onSearchDebounced: (value: string) => void
}

// Import Vue types for the return interface
import type { ComputedRef, Ref } from 'vue'
