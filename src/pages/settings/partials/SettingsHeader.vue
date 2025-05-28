<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'

defineProps<{
  title: string
  description?: string
  loading?: boolean
  workInProgress?: boolean
  refresh?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 items-center justify-between h-15">
    <div>
      <h3 class="text-lg font-medium">
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm text-muted-foreground">
        {{ description }}
      </p>
    </div>

    <div class="flex gap-2 items-center justify-end">
      <Badge v-if="workInProgress" variant="info">
        Work in progress
      </Badge>
      <LoadingIcon v-if="loading && !refresh" />
      <Button
        v-if="refresh"
        :loading
        variant="ghost"
        @click="emit('refresh')"
      >
        <RefreshCw class="size-4" />
      </Button>
      <slot name="right" />
    </div>
  </div>
</template>