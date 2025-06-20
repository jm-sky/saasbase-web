<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  mimeType: string
  class?: string
}>()

function resolveIcon(mime: string): string {
  if (mime.includes('pdf')) return 'fa6-regular:file-pdf'
  if (mime.includes('image')) return 'lucide:image'
  if (mime.includes('zip') || mime.includes('rar')) return 'lucide:archive'
  if (mime.includes('spreadsheet') || mime.includes('excel')) return 'lucide:table'
  if (mime.includes('word')) return 'lucide:file-word'
  if (mime.includes('text')) return 'lucide:file-text'
  return 'lucide:file'
}
</script>

<template>
  <Icon :icon="resolveIcon(mimeType)" :class="props.class ?? 'size-5 text-muted-foreground'" />
</template>