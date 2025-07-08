<script setup lang="ts">
import { Download, Eye, Trash } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MimeTypeIcon from '@/components/Icons/MimeTypeIcon.vue'
import Button from '@/components/ui/button/Button.vue'
import { formatFileSize } from '@/lib/formatFileSize'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IAttachment, IAttachmentService } from '../../types/attachment.type'

const { t } = useI18n()

const props = defineProps<{
  service: IAttachmentService
  attachment: IAttachment
  modelId?: string | null
  readOnly?: boolean
  downloadable?: boolean
  viewable?: boolean
  disabled?: boolean
  withIcon?: boolean
}>()

const emit = defineEmits<{
  delete: [attachment: IAttachment]
  deleted: [attachment: IAttachment]
  download: [attachment: IAttachment]
  view: [attachment: IAttachment]
}>()

const deleting = ref(false)

const handleDelete = async (attachment: IAttachment) => {
  if (!props.modelId) return
  if (!confirm(t('attachments.delete.confirm'))) return
  try {
    emit('delete', attachment)
    deleting.value = true
    await props.service.delete(props.modelId, attachment.id)
    emit('deleted', attachment)
  } catch (err) {
      handleErrorWithToast(t('attachments.upload.error'), err)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2"
    :class="[{ 'opacity-50 pointer-events-none': disabled }, { 'blur-[2px] opacity-50': deleting }]"
  >
    <!-- Left side: icon + info -->
    <div class="flex items-center gap-3 min-w-48">
      <MimeTypeIcon
        v-if="withIcon"
        :mime-type="attachment.mimeType"
        class="size-6 shrink-0 text-muted-foreground"
      />

      <div class="flex flex-col min-w-24">
        <div class="truncate">
          {{ attachment.fileName }}
        </div>
        <div class="text-xs text-muted-foreground">
          {{ formatFileSize(attachment.size) }} ·
          {{ attachment.mimeType }} ·
          {{ toDateTimeString(attachment.createdAt) }}
          <template v-if="$slots.meta">
            <slot name="meta" :meta="attachment.meta" />
          </template>
        </div>
      </div>
    </div>

    <!-- Right side: actions -->
    <div class="flex flex-1 items-center justify-end gap-1 shrink-0">
      <slot name="actions" :attachment="attachment" />

      <Button
        v-if="viewable && modelId"
        v-tooltip="t('common.view')"
        variant="ghost"
        size="icon"
        title="View"
        @click="emit('view', attachment)"
      >
        <Eye class="size-4" />
      </Button>

      <Button
        v-if="downloadable && modelId"
        v-tooltip="t('common.download')"
        variant="ghost"
        size="icon"
        title="Download"
        @click="emit('download', attachment)"
      >
        <Download class="size-4" />
      </Button>

      <Button
        v-if="!readOnly && modelId"
        v-tooltip="t('common.delete')"
        variant="ghost"
        class="hover:text-destructive"
        size="icon"
        title="Delete"
        :loading="deleting"
        @click="handleDelete(attachment)"
      >
        <Trash class="size-4" />
      </Button>
    </div>
  </div>
</template>
