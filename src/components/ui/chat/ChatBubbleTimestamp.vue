<script setup lang="ts">
import { defineProps } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  timestamp: string
  class?: string
}>()
</script>

<template>
  <div :class="cn('text-xs mt-2 text-right', props.class)">
    {{ props.timestamp }}
  </div>
</template>
