<script setup lang="ts">
import { Calendar, Circle } from 'lucide-vue-next'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import type { ITask } from '@/domains/task/types/task.type'

defineProps<{
  task: ITask
}>()
</script>

<template>
  <Card
    class="flex flex-col min-h-30 cursor-pointer shadow-md hover:border-primary hover:bg-primary-200/10 hover:shadow-lg transition-all duration-300"
  >
    <CardHeader>
      <CardTitle class="flex items-center gap-3">
        <Avatar>
          <AvatarImage :src="task.assignee?.avatarUrl ?? ''" />
          <AvatarFallback>
            {{ task.assignee?.name.slice(0, 2) }}
          </AvatarFallback>
        </Avatar>
        <span>
          {{ task.title }}
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-2">
      <div class="text-muted-foreground line-clamp-2">
        <p>{{ task.description }}</p>
      </div>
    </CardContent>
    <CardFooter class="mt-auto flex justify-between gap-2">
      <div class="flex items-center gap-2">
        <Calendar class="size-4" />
        <span class="text-sm">{{ task.dueDate ?? '-' }}</span>
      </div>
      <div class="flex items-center border p-2 rounded-md gap-2">
        <Circle class="size-4" :style="{ color: task.status.color }" />
        <span class="text-sm">{{ task.status.name ?? '-' }}</span>
      </div>
    </CardFooter>
  </Card>
</template>
