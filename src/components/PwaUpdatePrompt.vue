<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const { t } = useI18n()

const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  immediate: true,
  onRegisterError(error: unknown) {
    console.error('Service Worker registration error:', error)
  },
})

const close = () => {
  needRefresh.value = false
}

const update = async () => {
  await updateServiceWorker()
  needRefresh.value = false
  window.location.reload()
}
</script>

<template>
  <Dialog :open="needRefresh" @update:open="close">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ t('common.pwa.update.title') }}
        </DialogTitle>
        <DialogDescription>
          {{ t('common.pwa.update.description') }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          @click="close"
        >
          {{ t('common.pwa.update.later') }}
        </Button>
        <Button @click="update">
          {{ t('common.pwa.update.reload') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
