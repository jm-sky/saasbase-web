<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { formatDistanceToNow } from 'date-fns'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ActivityLog } from '@/types/activity-log'

const { t } = useI18n()

const props = defineProps<{
  log: ActivityLog
  icon: string
  color: string
}>()

const timeAgo = computed(() => {
  return formatDistanceToNow(new Date(props.log.createdAt), { addSuffix: true })
})
</script>

<template>
  <Card class="p-4">
    <div class="flex items-start gap-4">
      <div :class="cn('flex size-10 shrink-0 items-center justify-center rounded-full', color)">
        <Icon :icon="icon" class="size-5 text-white" />
      </div>
      <div class="flex-1 space-y-1">
        <p class="text-sm font-medium leading-none">
          {{ t(`log.${log.description}`) }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ timeAgo }}
        </p>
      </div>
    </div>
  </Card>
</template>
