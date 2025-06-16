<script setup lang="ts">
import type { TTagColor } from '../types/tag.type'
import { tagColor } from '../utils/tagColor'

defineProps<{
  text?: string
}>()

const emit = defineEmits<{
  select: [color: TTagColor]
}>()

const colors: TTagColor[] = [
  'default',
  'success',
  'success-intense',
  'danger',
  'danger-intense',
  'info',
  'info-intense',
  'warning',
  'warning-intense',
  'dark',
  'dark-intense',
  'notice',
  'notice-intense'
]
</script>


<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="color in colors"
      :key="color"
      class="py-0.5 px-2 rounded cursor-pointer hover:scale-105 hover:ring transition-all text-xs"
      :class="tagColor(color)"
      @click="emit('select', color)"
    >
      {{ text ?? color }}
    </div>
  </div>
</template>