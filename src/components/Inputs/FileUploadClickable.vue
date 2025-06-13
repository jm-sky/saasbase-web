<script setup lang="ts">
import { Upload } from 'lucide-vue-next'
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { uploadFileTypesMap } from '@/config'

const { t } = useI18n()

const { accept = uploadFileTypesMap.forOcr, multiple = false, disabled = false } = defineProps<{
  accept?: string
  multiple?: boolean
  disabled?: boolean
}>()

const files = defineModel<File[]>('files', { required: true })

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')

const handleFileInput = (event: Event) => {
  const newFiles = (event.target as HTMLInputElement).files
  if (newFiles) {
    files.value = [...files.value, ...newFiles]
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground h-8">
    <Upload class="size-4 text-gray-500" />
    {{ t('common.fileUpload.dropHere', 'Drop files to upload') }}
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
      @change="handleFileInput"
    >
  </div>
</template>