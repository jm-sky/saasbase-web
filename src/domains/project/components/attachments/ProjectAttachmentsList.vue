<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import DataListSection from '@/components/DataLists/DataListSection.vue'
import NoItems from '@/components/DataLists/NoItems.vue'
import FileUpload from '@/components/Inputs/FileUpload.vue'
import Button from '@/components/ui/button/Button.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { type IProjectAttachment, projectAttachmentsService } from '../../services/ProjectAttachmentsService'
import ProjectAttachmentsListItem from './ProjectAttachmentsListItem.vue'

const route = useRoute()
const { t } = useI18n()

const projectId = route.params.id as string
const attachments = ref<IProjectAttachment[]>([])
const loading = ref(false)
const uploading = ref(false)
const files = ref<File[]>([])

const refresh = async () => {
  try {
    loading.value = true
    const res = await projectAttachmentsService.index(projectId)
    attachments.value = res.data
  } catch (error) {
    handleErrorWithToast(t('attachments.list.error'), error)
  } finally {
    loading.value = false
  }
}

const handleUpload = async () => {
  if (!files.value.length) return
  try {
    uploading.value = true
    for (const file of files.value) {
      await projectAttachmentsService.upload(projectId, file)
    }
    files.value = []
    await refresh()
  } catch (error) {
    handleErrorWithToast(t('attachments.upload.error'), error)
  } finally {
    uploading.value = false
  }
}

const handleDelete = async (attachment: IProjectAttachment) => {
  if (!confirm(t('attachments.delete.confirm'))) return
  try {
    await projectAttachmentsService.delete(projectId, attachment.id)
    await refresh()
  } catch (error) {
    handleErrorWithToast(t('attachments.delete.error'), error)
  }
}

const handleDownload = async (attachment: IProjectAttachment) => {
  const blob = await projectAttachmentsService.download(projectId, attachment.id)
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = attachment.fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

onMounted(refresh)
</script>

<template>
  <DataListSection
    :title="t('attachments.title')"
    :loading="loading"
    :with-add-button="false"
    @refresh="refresh"
  >
    <div class="flex flex-col gap-1">
      <ProjectAttachmentsListItem
        v-for="attachment in attachments"
        :key="attachment.id"
        :attachment="attachment"
        :project-id="projectId"
        @download="handleDownload"
        @delete="handleDelete"
      />
      <NoItems v-if="attachments.length === 0" />
    </div>

    <FileUpload v-model="files" :disabled="uploading" />
    <Button
      variant="default"
      class="mt-2 mx-auto"
      :disabled="!files.length || uploading"
      @click="handleUpload"
    >
      Upload
    </Button>
  </DataListSection>
</template>
