<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GenericPicker } from '@/components/Pickers'
import Button from '@/components/ui/button/Button.vue'
import { config } from '@/config'
import TagList from '@/domains/tags/components/TagList.vue'
import type { IContractorLookup } from '../types/contractor.type'
import { contractorService, type IContractorFilters } from '../services/ContractorService'
import type { FilterDefinition } from '@/domains/shared/types/resource.type'
import type { PickerConfig } from '@/types/picker.types'

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
    filter: (filters ?? {}) as Record<string, FilterDefinition>,
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
        <div v-if="contractor.tags && contractor.tags.length > 0" class="text-xs text-muted-foreground truncate">
          <TagList :tags="contractor.tags as any" />
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