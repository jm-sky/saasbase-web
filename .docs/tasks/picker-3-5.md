// ============================================================================
// FILE 3: src/components/Pickers/PickerItem.vue
// ============================================================================

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'

const {
  value,
  selected = false,
  disabled = false,
  class: classProp
} = defineProps<{
  value: string
  selected?: boolean
  disabled?: boolean
  class?: string
}>()

const emit = defineEmits<{
  select: [event: CustomEvent]
}>()

const onSelect = (event: CustomEvent) => {
  if (!disabled) {
    emit('select', event)
  }
}
</script>

<template>
  <CommandItem
    :value="value"
    :disabled="disabled"
    :class="cn('cursor-pointer', classProp)"
    @select="onSelect"
  >
    <div class="flex items-center justify-between w-full min-w-0">
      <div class="flex-1 min-w-0">
        <slot />
      </div>
      <Check
        :class="cn(
          'ml-2 h-4 w-4 shrink-0',
          selected ? 'opacity-100' : 'opacity-0'
        )"
      />
    </div>
  </CommandItem>
</template>

// ============================================================================
// FILE 4: src/components/Pickers/PickerActions.vue
// ============================================================================

<script setup lang="ts">
import { cn } from '@/lib/utils'

const {
  class: classProp
} = defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="cn('flex gap-2 p-2 border-t border-border bg-muted/50', classProp)">
    <slot />
  </div>
</template>

// ============================================================================
// FILE 5: Update src/components/Pickers/index.ts
// ============================================================================

// Export all picker components
export { default as PickerPopover } from './PickerPopover.vue'
export { default as PickerContent } from './PickerContent.vue'
export { default as PickerList } from './PickerList.vue'
export { default as PickerItem } from './PickerItem.vue'
export { default as PickerActions } from './PickerActions.vue'

// Export types
export type {
  BasePickerItem,
  BasePickerFilters,
  PickerService,
  PickerConfig,
  PickerProps,
  PickerEvents,
  UsePickerLogicReturn
} from '../types/picker.types'

// Export composable
export { usePickerLogic } from '../composables/usePickerLogic'
