<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import NotificationsDrawerItem from './NotificationsDrawerItem.vue'

const { t } = useI18n()
const loading = ref(false)
const notifications = ref<INotification[]>([])

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

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button
        v-tooltip="t('notifications')"
        variant="ghost-primary"
        size="icon"
        class="rounded-full"
      >
        <UIIcon icon="lucide:bell" class="size-4" />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader class="border-b border-border">
        <SheetTitle>{{ $t('notifications') }}</SheetTitle>
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
