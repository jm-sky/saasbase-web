<script setup lang="ts">
import { computed } from 'vue'
import TagListItem from './TagListItem.vue'
import type { ITagPreview } from '@/domains/tags/types/tag.type'

const { tags, limit = 3 } = defineProps<{
  tags: ITagPreview[]
  limit?: number
}>()

const limitedTags = computed(() => tags.slice(0, limit))
const tooltipText = computed(() => tags.map(tag => tag.name).join(', '))
</script>

<template>
  <div
    v-tooltip="tooltipText"
    class="flex flex-wrap items-center gap-1 cursor-help max-w-full"
  >
    <span v-if="tags.length === 0">-</span>

    <TagListItem
      v-for="(tag, index) in limitedTags"
      :key="index"
      :tag="tag"
    />

    <span v-if="tags.length > limit" class="text-xs text-muted-foreground">+{{ tags.length - limit }}</span>
  </div>
</template>
