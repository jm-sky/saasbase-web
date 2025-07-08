<script setup lang="ts">
import { tagColor } from '@/domains/tags/utils/tagColor'
import type { ITagPreview } from '@/domains/tags/types/tag.type'

defineProps<{
  tag: ITagPreview
}>()
</script>

<template>
  <span
    class="text-xs rounded px-2 py-0.5"
    :class="tagColor(tag.color ?? 'default')"
  >
    {{ tag.name }}
  </span>
</template>
