<script setup lang="ts">
import { Pencil, Plus, RefreshCcw, Trash, Upload } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Avatar, AvatarFallback, AvatarImage, type AvatarVariants } from '@/components/ui/avatar'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { cn } from '@/lib/utils'

interface UploaderService {
  upload(id: string, file: File): Promise<void>
  delete(id: string): Promise<void>
}

const { t } = useI18n()

const { modelId, autoUpload, avatarUrl, uploaderService, readonly } = defineProps<{
  modelId: string
  avatarUrl?: string
  fallbackText?: string
  disabled?: boolean
  autoUpload?: boolean
  uploaderService?: UploaderService
  avatarClass?: string
  shape?: AvatarVariants['shape']
  size?: AvatarVariants['size']
  readonly?: boolean
}>()

const emit = defineEmits<{
  upload: [File]
  uploaded: []
  remove: []
  removed: []
}>()

const file = defineModel<File | null>()
const fileInput = ref<HTMLInputElement>()
const isUploaded = ref(false)
const isUploading = ref(false)
const isRemoved = ref(false)
const isRemoving = ref(false)

const isLoading = computed<boolean>(() => isUploading.value || isRemoving.value)

const previewUrl = computed<string | null>(() => {
  if (isRemoved.value) return null
  if (file.value) return URL.createObjectURL(file.value)
  if (avatarUrl) return avatarUrl
  return null
})

const canAdd = computed<boolean>(() => (!file.value && !avatarUrl) || isRemoved.value)
const canChange = computed<boolean>(() => (!!file.value || !!avatarUrl) && !isRemoved.value)
const canUpload = computed<boolean>(() => !!file.value && !isUploaded.value)
const canRemove = computed<boolean>(() => (!!file.value || !!avatarUrl || isUploaded.value) && !isRemoved.value)

const onFileChange = async (e: Event) => {
  if (readonly) return

  const target = e.target as HTMLInputElement
  const selected = target.files?.[0] ?? null
  isUploaded.value = false

  if (selected) {
    file.value = selected
    target.value = ''
  }

  if (autoUpload) {
    await upload()
  }
}

const upload = async () => {
  if (readonly) return
  if (!file.value) return

  emit('upload', file.value)

  if (!uploaderService) return

  try {
    isUploading.value = true
    await uploaderService.upload(modelId, file.value)
    isUploaded.value = true
    isRemoved.value = false
    emit('uploaded')
  } catch (error) {
    file.value = null
    handleErrorWithToast(t('errors.uploadFailed'), error)
  } finally {
    isUploading.value = false
  }
}

const removeFile = async () => {
  if (readonly) return

  file.value = null
  emit('remove')

  if (!avatarUrl) return
  if (!uploaderService) return

  try {
    isRemoving.value = true
    await uploaderService.delete(modelId)
    isUploaded.value = false
    isRemoved.value = true
    emit('removed')
  } catch (error) {
    handleErrorWithToast(t('errors.uploadFailed'), error)
  } finally {
    isRemoving.value = false
  }
}
</script>

<template>
  <div
    class="relative group inline-block w-fit mx-auto [&>button]:opacity-0 [&>button]:transition-opacity [&>button]:duration-300"
    tabindex="-1"
    :class="{ 'opacity-50': isLoading }"
  >
    <Avatar :size :shape :class="cn('border shadow', avatarClass)">
      <AvatarImage v-if="previewUrl" :src="previewUrl" alt="avatar" />
      <AvatarFallback>{{ fallbackText ?? '?' }}</AvatarFallback>
      <RefreshCcw v-if="isLoading" class="absolute text-gray-700 animate-spin" />
    </Avatar>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      :disabled
      @change="onFileChange"
    >

    <button
      v-if="!readonly && canAdd"
      v-tooltip.bottom.focus="t('common.add')"
      class="absolute bottom-0 -right-5 p-1.5 bg-white rounded-full shadow group-focus:opacity-90 group-hover:opacity-90 hover:bg-gray-100"
      :disabled
      type="button"
      @click="fileInput?.click()"
    >
      <Plus class="w-4 h-4 text-gray-700" />
    </button>

    <button
      v-else-if="!readonly && canChange"
      v-tooltip.bottom.focus="t('common.edit')"
      class="absolute bottom-0 -right-5 p-1.5 bg-white rounded-full shadow group-focus:opacity-90 group-hover:opacity-90 hover:bg-gray-100"
      :disabled
      type="button"
      @click="fileInput?.click()"
    >
      <Pencil class="w-4 h-4 text-gray-700" />
    </button>

    <button
      v-if="!readonly && canUpload"
      v-tooltip.bottom.focus="t('common.upload')"
      class="absolute bottom-0 -right-5 p-1.5 bg-white rounded-full shadow group-focus:opacity-90 group-hover:opacity-90 hover:bg-gray-100"
      :disabled
      type="button"
      @click="upload()"
    >
      <Upload class="w-4 h-4 text-gray-700" />
    </button>

    <button
      v-if="!readonly && canRemove"
      v-tooltip.bottom.focus="t('common.remove')"
      class="absolute top-0 -right-5 p-1.5 bg-white rounded-full shadow group-hover:opacity-90 hover:bg-red-100"
      :disabled
      type="button"
      @click="removeFile"
    >
      <Trash class="w-4 h-4 text-red-500" />
    </button>
  </div>
</template>
