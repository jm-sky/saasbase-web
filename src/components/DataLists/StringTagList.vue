<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

const  { tags = [] } = defineProps<{
  tags?: string[]
}>()
</script>

<template>
  <div class="mt-1 flex gap-2">
    <Badge v-for="tag in tags" :key="tag" variant="outline">
      {{ tag }}
    </Badge>
    <span v-if="tags.length === 0">
      -
    </span>
  </div>
</template>