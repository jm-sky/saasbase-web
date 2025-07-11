// ============================================================================
// FILE 6: src/components/Pickers/GenericPicker.vue
// ============================================================================

<script setup lang="ts" generic="TItem extends BasePickerItem, TFilters extends BasePickerFilters">
import { useInfiniteScroll } from '@vueuse/core'
import { Plus } from 'lucide-vue-next'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { CommandGroup } from '@/components/ui/command'
import {
  PickerActions,
  PickerContent,
  PickerItem,
  PickerList,
  PickerPopover
} from '@/components/Pickers'
import { usePickerLogic } from '@/composables/usePickerLogic'
import type {
  BasePickerItem,
  BasePickerFilters,
  PickerConfig,
  PickerProps,
  PickerEvents
} from '../types/picker.types'

const { t } = useI18n()

// Props
const {
  modelValue,
  id,
  class: classProp,
  popoverContentClass,
  disabled = false,
  placeholder,
  showCreateButton = false,
  showVatId = false,
  perPage = 20,
  maxHeight = '300px',
  config: pickerConfig,
  customFilters,
  recentLabel = 'Recent',
  allLabel = 'All Items'
} = defineProps<PickerProps<TItem> & {
  config: PickerConfig<TItem, TFilters>
  customFilters?: Record<string, unknown>
  recentLabel?: string
  allLabel?: string
}>()

// Events
const emit = defineEmits<PickerEvents<TItem>>()

// Use picker logic
const {
  open,
  search,
  items,
  recentSelections,
  loading,
  error,
  hasMoreData,
  groupedItems,
  onSelect: handleSelect,
  loadMore,
  clearCache,
  onSearchDebounced,
  listRef,
} = usePickerLogic<TItem, TFilters>(
  {
    ...pickerConfig,
    perPage,
  },
  customFilters
)

// Infinite scroll setup
useInfiniteScroll(
  listRef,
  loadMore,
  { distance: 10 }
)

// Selection handler with emit
const onSelect = (event: any) => {
  const selectedItem = handleSelect(event.detail.value)
  if (selectedItem) {
    emit('update:modelValue', selectedItem)
    emit('update:id', selectedItem.id)
  }
}

// Watch modelValue changes to sync id
watch(() => modelValue, (newValue) => {
  emit('update:id', newValue?.id)
}, { immediate: true })

// Clear cache and emit
const handleClearCache = () => {
  clearCache()
}

// Create handler
const handleCreate = () => {
  emit('create')
}

// Error handler
const handleError = (err: Error) => {
  emit('error', err)
}

// Expose methods for parent components
defineExpose({
  refresh: clearCache,
  clearRecent: () => {
    // Could add a method to clear recent selections
  },
  open: () => { open.value = true },
  close: () => { open.value = false }
})
</script>

<template>
  <PickerPopover
    :open="open"
    :disabled="disabled || loading"
    :class="classProp"
    :popover-content-class="popoverContentClass"
    :placeholder="placeholder"
    :model-value="modelValue"
    @update:open="open = $event"
  >
    <template #trigger>
      <slot name="trigger" :selected="modelValue" :open="open">
        <span class="truncate">
          {{ modelValue?.name ?? placeholder ?? t('shared.select') }}
        </span>
      </slot>
    </template>

    <PickerContent
      :search="search"
      :search-placeholder="t('shared.search')"
      :error="error"
      @update:search="search = $event"
      @search-input="onSearchDebounced"
    />

    <PickerList
      ref="listRef"
      :max-height="maxHeight"
      :loading="loading"
      :has-more-data="hasMoreData"
      :show-create-button="showCreateButton"
      :empty-message="t('shared.notFound')"
      :load-more-message="t('shared.scrollForMore')"
      :loading-message="t('common.loading')"
      @create="handleCreate"
    >
      <!-- Recent Selections Group -->
      <CommandGroup 
        v-if="groupedItems.recent.length > 0" 
        :heading="recentLabel"
      >
        <PickerItem
          v-for="item in groupedItems.recent"
          :key="`recent-${item.id}`"
          :value="item.id"
          :selected="modelValue?.id === item.id"
          :disabled="loading"
          @select="onSelect"
        >
          <slot name="option" :item="item" :selected="modelValue?.id === item.id" :recent="true">
            <div class="flex flex-col w-full min-w-0">
              <div class="text-sm font-medium truncate">
                {{ item.name }}
              </div>
            </div>
          </slot>
        </PickerItem>
      </CommandGroup>

      <!-- All Items Group -->
      <CommandGroup 
        v-if="groupedItems.others.length > 0"
        :heading="groupedItems.recent.length > 0 ? allLabel : undefined"
      >
        <PickerItem
          v-for="item in groupedItems.others"
          :key="item.id"
          :value="item.id"
          :selected="modelValue?.id === item.id"
          :disabled="loading"
          @select="onSelect"
        >
          <slot name="option" :item="item" :selected="modelValue?.id === item.id" :recent="false">
            <div class="flex flex-col w-full min-w-0">
              <div class="text-sm truncate">
                {{ item.name }}
              </div>
            </div>
          </slot>
        </PickerItem>
      </CommandGroup>
    </PickerList>

    <PickerActions v-if="$slots.actions || showCreateButton">
      <slot name="actions" :refresh="handleClearCache" :clear-cache="handleClearCache">
        <Button variant="outline" size="sm" @click="handleClearCache">
          {{ t('common.clearCache', 'Clear cache') }}
        </Button>
        <Button
          v-if="showCreateButton"
          variant="outline"
          size="sm"
          @click="handleCreate"
        >
          <Plus class="mr-2 h-4 w-4" />
          {{ t('shared.create') }}
        </Button>
      </slot>
    </PickerActions>
  </PickerPopover>
</template>

// ============================================================================
// FILE 7: EXAMPLE - Updated ContractorPicker.vue
// ============================================================================

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GenericPicker } from '@/components/Pickers'
import TagList from '@/domains/tags/components/TagList.vue'
import { config } from '@/config'
import type { IContractorLookup } from '../types/contractor.type'
import { contractorService, type IContractorFilters } from '../services/ContractorService'
import type { FilterDefinition } from '@/domains/shared/types/resource.type'
import type { PickerConfig } from '@/components/Pickers'

const { t } = useI18n()

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IContractorLookup | undefined>('modelValue', { required: true })

const {
  popoverContentClass,
  disabled,
  class: classProp,
  type = 'buyer',
  showCreateButton = false,
  showVatId = true,
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

// Build custom filters based on contractor type
const customFilters = computed(() => {
  const filterData: Record<string, FilterDefinition> = {}

  if (type === 'supplier') {
    filterData.isSupplier = { value: true }
  }

  if (type === 'buyer') {
    filterData.isBuyer = { value: true }
  }

  return filterData
})

// Configuration for the generic picker
const pickerConfig: PickerConfig<IContractorLookup, IContractorFilters> = {
  service: contractorService,
  storageKey: `${config.appId}:contractor-recent-${type}`,
  perPage,
  maxRecentItems: 3,
  softRefreshInterval: 5 * 60 * 1000, // 5 minutes
  
  // Custom filter builder for contractor-specific logic
  buildFilters: (searchValue: string, page: number, perPageValue: number, filters?: Record<string, unknown>) => ({
    search: searchValue,
    filter: filters || {},
    page,
    perPage: perPageValue,
  })
}
</script>

<template>
  <GenericPicker
    v-model:model-value="modelValue"
    v-model:id="id"
    :config="pickerConfig"
    :custom-filters="customFilters"
    :disabled="disabled"
    :class="classProp"
    :popover-content-class="popoverContentClass"
    :placeholder="t('shared.contractor.select')"
    :show-create-button="showCreateButton"
    :per-page="perPage"
    :max-height="maxHeight"
    :recent-label="t('shared.contractor.recent')"
    :all-label="t('shared.contractor.all')"
    @create="emit('create')"
    @error="emit('error', $event)"
  >
    <template #trigger="{ selected }">
      <slot name="trigger">
        <span class="truncate">
          {{ selected?.name ?? t('shared.contractor.select') }}
        </span>
      </slot>
    </template>

    <template #option="{ item: contractor, recent }">
      <div class="flex flex-col w-full min-w-0">
        <div class="text-sm truncate" :class="{ 'font-medium': recent }">
          {{ contractor.name }}
        </div>
        <div v-if="showVatId && contractor.vatId" class="text-xs text-muted-foreground truncate">
          {{ t('contractor.fields.vatId') }}: {{ contractor.vatId }}
        </div>
        <div v-if="contractor.tags?.length > 0" class="text-xs text-muted-foreground truncate">
          <TagList :tags="contractor.tags" />
        </div>
      </div>
    </template>

    <template #actions="{ clearCache }">
      <Button variant="outline" size="sm" @click="clearCache">
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
    </template>
  </GenericPicker>
</template>
