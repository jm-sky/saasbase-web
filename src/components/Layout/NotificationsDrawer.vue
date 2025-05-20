<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { timeAgo } from '@/lib/timeAgo'
import Separator from '../ui/separator/Separator.vue'
import SheetFooter from '../ui/sheet/SheetFooter.vue'
import UIIcon from '../UIIcon.vue'

interface INotification {
  id: string
  title: string
  description: string
  read: boolean
  createdAt: string
  icon: string
  source: string
}

const notifications = ref<INotification[]>([
  {
    id: '96584686-5952-59de-9c5d-82bdddbd01be',
    title: 'New message',
    description: 'You have a new message',
    read: false,
    createdAt: '2025-05-01 12:00:00',
    icon: 'lucide:message-circle',
    source: 'System',
  },
  {
    id: '96584686-5952-59de-9c5d-82bdddbd01be',
    title: 'Email verified',
    description: 'Your email has been verified',
    read: false,
    createdAt: '2025-05-01 12:00:00',
    icon: 'lucide:mail',
    source: 'System',
  },
  {
    id: '96584686-5952-59de-9c5d-82bdddbd01be',
    title: 'Password reset',
    description: 'Your password has been reset',
    read: false,
    createdAt: '2025-05-08 14:00:00',
    icon: 'lucide:lock',
    source: 'System',
  },
])
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button variant="ghost" size="icon">
        <UIIcon icon="lucide:bell" class="size-4" />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader class="border-b border-border">
        <SheetTitle>Notifications</SheetTitle>
      </SheetHeader>
      <div class="grow flex flex-col gap-4 pb-4 border-border">
        <template v-for="(notification, index) in notifications" :key="notification.id">
          <div class="flex gap-2.5 px-5 py-2.5">
            <div class="size-8">
              <div class="size-8 rounded-full bg-muted flex items-center justify-center">
                <UIIcon :icon="notification.icon" class="size-4" />
              </div>
              <div class="kt-avatar-indicator -end-2 -bottom-2">
                <div class="kt-avatar-status kt-avatar-status-online size-2.5" />
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-1">
                <div class="text-sm font-medium">
                  {{ notification.title }}
                </div>
                <span class="flex items-center text-xs font-medium text-muted-foreground">
                  {{ timeAgo(notification.createdAt) }}
                  <span class="rounded-full size-1 bg-muted-foreground/50 mx-1.5" />
                  {{ notification.source }}
                </span>
              </div>
              <div class="text-sm">
                {{ notification.description }}
              </div>
            </div>
          </div>
          <Separator v-if="index < notifications.length - 1" />
        </template>
      </div>
      <SheetFooter class="absolute bottom-0 right-0 w-full grid grid-cols-2 gap-2.5 p-5 border-t">
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
        <Button variant="outline" size="sm">
          Archive all
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>