<script setup lang="ts" generic="TItem extends BasePickerItem, TFilters extends BasePickerFilters">
import { useInfiniteScroll } from '@vueuse/core'
import { Plus } from 'lucide-vue-next'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PickerActions,
  PickerContent,
  PickerItem,
  PickerList,
  PickerPopover
} from '@/components/Pickers'
import Button from '@/components/ui/button/Button.vue'
import { CommandGroup } from '@/components/ui/command'
import { usePickerLogic } from '@/composables/usePickerLogic'
import type {
  BasePickerFilters,
  BasePickerItem,
  PickerConfig,
  PickerEvents,
  PickerProps
} from '@/types/picker.types'

const { t } = useI18n()

// Props
const {
  modelValue,
  class: classProp,
  popoverContentClass,
  disabled,
  placeholder,
  showCreateButton,
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
const onSelect = (event: CustomEvent) => {
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
          <slot
            name="option"
            :item="item"
            :selected="modelValue?.id === item.id"
            :recent="true"
          >
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
          <slot
            name="option"
            :item="item"
            :selected="modelValue?.id === item.id"
            :recent="false"
          >
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