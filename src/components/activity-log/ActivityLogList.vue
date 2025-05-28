<script setup lang="ts" generic="T extends ActivityLog">
import { ScrollArea } from '@/components/ui/scroll-area'
import NoItems from '../DataLists/NoItems.vue'
import ActivityLogItem from './ActivityLogItem.vue'
import type { ActivityLog } from '@/types/activity-log'

export type GetActivityLogIcon<T> = (log: T) => string
export type GetActivityLogColor<T> = (log: T) => string

defineProps<{
  logs: T[]
  getIcon: GetActivityLogIcon<T>
  getColor: GetActivityLogColor<T>
}>()
</script>

<template>
  <ScrollArea class="h-[calc(100vh-12rem)]">
    <div class="space-y-4 p-4">
      <ActivityLogItem
        v-for="log in logs"
        :key="log.id"
        :log="log"
        :icon="getIcon(log)"
        :color="getColor(log)"
      />
      <NoItems v-if="logs.length === 0" />
    </div>
  </ScrollArea>
</template>
