<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const modelValue = defineModel<string>('modelValue', { required: true })

const props = defineProps<{
  class?: string
}>()

const options = [
  { value: 'Y-m-d', label: '2024-07-06' },
  { value: 'd/m/Y', label: '06/07/2024' },
  { value: 'm/d/Y', label: '07/06/2024' },
  { value: 'd.m.Y', label: '06.07.2024' },
  { value: 'F j, Y', label: 'July 6, 2024' }
]
</script>

<template>
  <Select v-model="modelValue">
    <SelectTrigger :class="cn('w-full', props.class)">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
