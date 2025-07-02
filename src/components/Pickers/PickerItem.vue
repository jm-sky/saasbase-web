<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import {
  CommandItem,
} from '@/components/ui/command'

const {
  value,
  isSelected = false,
  isLoading = false
} = defineProps<{
  value: string
  isSelected?: boolean
  isLoading?: boolean
}>()

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select: [event: any]
}>()
</script>

<template>
  <CommandItem
    :value="value"
    :class="isLoading ? 'opacity-50' : ''"
    @select="emit('select', $event)"
  >
    <Check
      class="mr-2 size-4"
      :class="isSelected ? 'opacity-100' : 'opacity-0'"
    />
    <div class="flex flex-col w-full min-w-0">
      <slot />
    </div>
  </CommandItem>
</template>
