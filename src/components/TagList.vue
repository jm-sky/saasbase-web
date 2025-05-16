<script setup lang="ts">
import { computed } from 'vue'

const { tags, limit = 3 } = defineProps<{
  tags: string[]
  limit?: number
}>()

const limitedTags = computed(() => tags.slice(0, limit))
const tooltipText = computed(() => tags.join(', '))
</script>

<template>
  <div
    v-tooltip="tooltipText"
    class="flex flex-wrap gap-1 cursor-help max-w-full"
  >
    <span
      v-for="(tag, index) in limitedTags"
      :key="index"
      class="text-xs bg-muted text-muted-foreground rounded px-2 py-0.5"
    >
      {{ tag }}
    </span>
    <span v-if="tags.length > limit" class="text-xs text-muted-foreground">+{{ tags.length - limit }}</span>
  </div>
</template>
