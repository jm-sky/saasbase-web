<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import NoItems from '@/components/DataLists/NoItems.vue'
import FileUpload from '@/components/Inputs/FileUpload.vue'
import Button from '@/components/ui/button/Button.vue'
import { downloadBlob } from '@/lib/downloadBlob'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import AttachmentListItem from './AttachmentListItem.vue'
import type { IAttachment, IAttachmentService } from '../../types/attachment.type'

const { t } = useI18n()

const props = defineProps<{
  modelId?: string | null
  service: IAttachmentService
  title?: string
  accept?: string
  multiple?: boolean
  readOnly?: boolean
  downloadable?: boolean
  viewable?: boolean
  withIcon?: boolean
  disabled?: boolean
}>()

const attachments = ref<IAttachment[]>([])
const files = ref<File[]>([])
const loading = ref(false)
const uploading = ref(false)

const emit = defineEmits<{
  upload: []
  delete: []
}>()

const refresh = async () => {
  if (!props.modelId) return

  try {
    loading.value = true
    const res = await props.service.index(props.modelId)
    attachments.value = res.data
  } catch (err) {
    handleErrorWithToast(t('attachments.list.error'), err)
  } finally {
    loading.value = false
  }
}

const handleUpload = async () => {
  if (!props.modelId) return
  if (!files.value.length) return

  try {
    uploading.value = true
    for (const file of files.value) {
      await props.service.upload(props.modelId, file)
    }
    files.value = []
    await refresh()
    emit('upload')
  } catch (err) {
    handleErrorWithToast(t('attachments.upload.error'), err)
  } finally {
    uploading.value = false
  }
}

const handleDownload = async (attachment: IAttachment) => {
  if (!props.modelId) return

  const blob = await props.service.download(props.modelId, attachment.id)
  downloadBlob(blob, attachment.fileName)
}

const handleView = (attachment: IAttachment) => {
  console.log(attachment)
  // props.service.view(props.modelId, attachment)
}

defineExpose({
  loading,
  refresh,
})

watch(
  () => props.modelId,
  () => {
    void refresh()
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <section class="space-y-3">
    <h3 v-if="title" class="text-lg font-semibold">
      {{ title }}
    </h3>

    <div class="space-y-2">
      <AttachmentListItem
        v-for="attachment in attachments"
        :key="attachment.id"
        :model-id
        :service
        :attachment
        :read-only
        :downloadable
        :viewable
        :with-icon
        :disabled="disabled || uploading"
        @deleted="refresh"
        @download="handleDownload"
        @view="handleView"
      >
        <template #actions>
          <slot name="actions" :attachment="attachment" />
        </template>
        <template #meta="{ meta }">
          <slot name="meta" :meta="meta" />
        </template>
      </AttachmentListItem>

      <NoItems v-if="attachments.length === 0 && !loading" :message="t('attachments.list.noAttachments')" />
    </div>

    <div v-if="!readOnly" class="flex flex-col items-center gap-4">
      <FileUpload
        v-model="files"
        :disabled="uploading"
        :service
        :model-id
        :accept
        :multiple
      />
      <Button
        variant="default"
        :disabled="!files.length || uploading"
        @click="handleUpload"
      >
        {{ t('common.fileUpload.upload') }}
      </Button>
    </div>
  </section>
</template>
