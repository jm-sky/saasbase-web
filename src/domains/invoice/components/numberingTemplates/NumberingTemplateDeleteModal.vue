<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const { t } = useI18n()

defineProps<{
  open: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
}>()

const handleConfirm = () => {
  emit('confirm')
}
</script>

<template>
  <Dialog 
    :open="open" 
    @update:open="emit('update:open', $event)"
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ t('invoice.numberingTemplate.actions.deleteTemplate.confirm') }}
        </DialogTitle>
        <DialogDescription>
          {{ t('invoice.numberingTemplate.actions.deleteTemplate.confirmDescription') }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          @click="emit('update:open', false)"
        >
          {{ t('invoice.numberingTemplate.actions.cancel') }}
        </Button>
        <Button 
          variant="destructive"
          :disabled="loading"
          @click="handleConfirm"
        >
          {{ loading ? t('common.loading') : t('invoice.numberingTemplate.actions.delete') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>