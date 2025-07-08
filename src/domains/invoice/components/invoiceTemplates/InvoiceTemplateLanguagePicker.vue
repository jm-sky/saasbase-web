<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const modelValue = defineModel<string>('modelValue', { required: true })

const props = defineProps<{
  class?: string
}>()

const options = [
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polski' },
  { value: 'uk', label: 'Українська' },
  { value: 'ru', label: 'Русский' }
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
