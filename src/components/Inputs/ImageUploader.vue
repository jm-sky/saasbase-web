<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  imageUrl?: string
  class?: HTMLAttributes['class']
  error?: string
  accept?: string
  disabled?: boolean
}>()

const { t } = useI18n()

const file = defineModel<File | undefined>({ required: true })

const isDragging = ref(false)
const isRemoved = ref(false)
const fileInput = ref<HTMLInputElement>()

const previewUrl = computed<string | null>(() => {
  if (isRemoved.value) return null
  if (file.value) return URL.createObjectURL(file.value)
  if (props.imageUrl) return props.imageUrl
  return null
})

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false

  if (!e.dataTransfer?.files) return

  const newFiles = Array.from(e.dataTransfer.files)

  file.value = newFiles[0]
}

const handleFileInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files) return

  const newFiles = Array.from(input.files)

  file.value = newFiles[0]

  input.value = ''
}

const removeFile = () => {
  if (!file.value) return
  file.value = undefined
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
</script>

<template>
  <div
    :class="cn(
      'relative flex min-h-[150px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors',
      isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary',
      error ? 'border-destructive' : '',
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      previewUrl ? 'border-solid' : '',
      props.class
    )"
    :style="{ backgroundImage: `url(${previewUrl})` }"
    class="bg-cover bg-center"
    @dragenter.prevent="!disabled && (isDragging = true)"
    @dragleave.prevent="!disabled && (isDragging = false)"
    @dragover.prevent
    @drop="!disabled && handleDrop"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :disabled="disabled"
      class="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
      @change="handleFileInput"
    >

    <div v-if="!file" class="text-center transition-transform">
      <div class="text-gray-500">
        {{ t('common.fileUpload.dragAndDrop') }}
      </div>
      <div class="text-sm text-gray-400 mt-1">
        {{ accept ? t('common.fileUpload.acceptedFormats', { formats: accept }) : t('common.fileUpload.allFilesAccepted') }}
      </div>
    </div>

    <div v-if="file" class="w-full mt-auto relative z-10">
      <div class="flex flex-row items-center justify-between rounded-md bg-gray-50/50 backdrop-blur-xs py-2 px-3">
        <div class="flex items-center space-x-2">
          <span class="text-sm">{{ file.name }}</span>
          <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
        </div>
        <button
          type="button"
          class="text-sm text-gray-500 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50 relative z-20"
          :disabled="disabled"
          @click.stop="removeFile()"
        >
          {{ t('common.fileUpload.remove') }}
        </button>
      </div>
    </div>
  </div>
</template>
