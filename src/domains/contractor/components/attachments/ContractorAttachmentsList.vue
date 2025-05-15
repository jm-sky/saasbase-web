<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import FileUpload from '@/components/Inputs/FileUpload.vue'
import Button from '@/components/ui/button/Button.vue'
import { contractorAttachmentsService, type IContractorAttachment } from '@/domains/contractor/services/ContractorAttachmentsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import DataListSection from '../DataListSection.vue'
import NoItems from '../NoItems.vue'
import ContractorAttachmentsListItem from './ContractorAttachmentsListItem.vue'

const route = useRoute()
const { t } = useI18n()

const contractorId = route.params.id as string
const attachments = ref<IContractorAttachment[]>([])
const loading = ref(false)
const uploading = ref(false)
const files = ref<File[]>([])

const refresh = async () => {
  try {
    loading.value = true
    const res = await contractorAttachmentsService.index(contractorId)
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
      await contractorAttachmentsService.upload(contractorId, file)
    }
    files.value = []
    await refresh()
  } catch (error) {
    handleErrorWithToast(t('attachments.upload.error'), error)
  } finally {
    uploading.value = false
  }
}

const handleDelete = async (attachment: IContractorAttachment) => {
  if (!confirm(t('attachments.delete.confirm'))) return
  try {
    await contractorAttachmentsService.delete(contractorId, attachment.id)
    await refresh()
  } catch (error) {
    handleErrorWithToast(t('attachments.delete.error'), error)
  }
}

const handleDownload = async (attachment: IContractorAttachment) => {
  const blob = await contractorAttachmentsService.download(contractorId, attachment.id)
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
      <ContractorAttachmentsListItem
        v-for="attachment in attachments"
        :key="attachment.id"
        :attachment="attachment"
        :contractor-id="contractorId"
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
