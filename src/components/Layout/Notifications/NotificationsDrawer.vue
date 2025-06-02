<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NoItems from '@/components/DataLists/NoItems.vue'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import SheetFooter from '@/components/ui/sheet/SheetFooter.vue'
import UIIcon from '@/components/UIIcon.vue'
import { type INotification, notificationsService } from '@/domains/account/services/Notifications.service'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import echo from '@/plugins/echo'
import NotificationsDrawerItem from './NotificationsDrawerItem.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const loading = ref(false)
const notifications = ref<INotification[]>([])

const unreadNotifications = computed(() => notifications.value.filter(notification => !notification.readAt))
const unreadTotal = computed(() => unreadNotifications.value.length)

const refresh = async () => {
  try {
    loading.value = true
    notifications.value = await notificationsService.getNotifications()
  } catch (error) {
    handleErrorWithToast('Failed to fetch notifications', error)
  } finally {
    loading.value = false
  }
}

const handleNotificationCreated = (notification: INotification) => {
  notifications.value.unshift(notification)
}

const startListen = () => {
  const channel = echo.private(`users.${authStore.user?.id}.notifications`)
  channel.listen('.notifications', handleNotificationCreated)
  channel.error((error: unknown) => {
    console.error('[NotificationsDrawer] Error joining room', error)
  })
}

onMounted(async () => {
  await refresh()
  startListen()
})
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button
        v-tooltip="t('notifications.title')"
        variant="ghost-primary"
        size="icon"
        class="relative rounded-full"
      >
        <UIIcon icon="lucide:bell" class="size-4" />
        <span v-if="unreadTotal > 0" class="absolute top-0 right-0 text-xs size-4 rounded-full bg-red-500 text-primary-foreground">{{ unreadTotal }}</span>
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader class="border-b border-border">
        <SheetTitle>{{ $t('notifications.title') }}</SheetTitle>
      </SheetHeader>
      <div class="grow flex flex-col gap-4 pb-4 border-border">
        <div v-if="loading" class="flex items-center justify-center h-full">
          <UIIcon icon="lucide:loader" class="size-4 animate-spin" />
        </div>

        <NoItems v-else-if="notifications.length === 0" />

        <template v-else-if="notifications.length > 0">
          <template v-for="(notification, index) in notifications" :key="notification.id">
            <NotificationsDrawerItem :notification="notification" />
            <Separator v-if="index < notifications.length - 1" />
          </template>
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
