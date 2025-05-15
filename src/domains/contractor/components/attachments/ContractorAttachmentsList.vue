<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import FileUpload from '@/components/Inputs/FileUpload.vue'
import Button from '@/components/ui/button/Button.vue'
import { contractorAttachmentsService, type IContractorAttachment } from '@/domains/contractor/services/ContractorAttachmentsService'

const route = useRoute()
const contractorId = route.params.id as string
const attachments = ref<IContractorAttachment[]>([])
const loading = ref(false)
const uploading = ref(false)
const files = ref<File[]>([])

const fetchAttachments = async () => {
  loading.value = true
  try {
    const res = await contractorAttachmentsService.index(contractorId)
    attachments.value = res.data
  } finally {
    loading.value = false
  }
}

const handleUpload = async () => {
  if (!files.value.length) return
  uploading.value = true
  try {
    for (const file of files.value) {
      await contractorAttachmentsService.upload(contractorId, file)
    }
    files.value = []
    await fetchAttachments()
  } finally {
    uploading.value = false
  }
}

const handleDelete = async (attachment: IContractorAttachment) => {
  await contractorAttachmentsService.delete(contractorId, attachment.id)
  await fetchAttachments()
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

onMounted(fetchAttachments)
</script>
<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <div class="font-bold">
        Attachments
      </div>
    </div>
    <div v-if="loading" class="mt-4">
      Loading...
    </div>
    <div v-else class="my-4">
      <table class="min-w-full text-sm">
        <thead>
          <tr>
            <th>File name</th>
            <th>Size</th>
            <th>Type</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attachment in attachments" :key="attachment.id">
            <td>{{ attachment.fileName }}</td>
            <td>{{ (attachment.fileSize / 1024).toFixed(1) }} KB</td>
            <td>{{ attachment.mimeType }}</td>
            <td>{{ new Date(attachment.createdAt).toLocaleString() }}</td>
            <td>
              <button class="btn btn-xs btn-secondary mr-1" @click="handleDownload(attachment)">
                Download
              </button>
              <button class="btn btn-xs btn-danger" @click="handleDelete(attachment)">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && attachments.length === 0" class="mt-4 text-center text-sm text-muted-foreground">
        No attachments found
      </div>
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
  </div>
</template>
