<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FileDropZoneSlot from '@/components/Inputs/FileDropZoneSlot.vue'
import FileList from '@/components/Inputs/FileList.vue'
import FileUploadClickable from '@/components/Inputs/FileUploadClickable.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertDescription from '@/components/ui/alert/AlertDescription.vue'
import Button from '@/components/ui/button/Button.vue'
import { useToast } from '@/components/ui/toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import { expenseService, type IUploadForOcr } from '../services/expenseService'

const { t } = useI18n()
const { toast } = useToast()

const isOpen = defineModel<boolean>('isOpen', { required: true })
const draggedFiles = defineModel<File[]>('draggedFiles', { required: true })

const emit = defineEmits<{
  uploaded: []
}>()

const { handleSubmit, isSubmitting, errors, setFieldValue, setErrors } = useForm<IUploadForOcr>({
  initialValues: {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    files: draggedFiles.value,
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await expenseService.uploadForOcr(values)
    toast.success(t('expense.uploadForOcr.success', 'Files uploaded successfully'))
    isOpen.value = false
    draggedFiles.value = []
    emit('uploaded')
  } catch (error) {
    console.error(error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('expense.uploadForOcr.error', 'Failed to upload files'), error)
  }
})

watch(draggedFiles, (value) => {
  setFieldValue('files', value)
})

watch(isOpen, (value) => {
  if (!value) {
    draggedFiles.value = []
  }
})
</script>


<template>
  <ModalComponent v-model:open="isOpen" :title="t('expense.uploadForOcr.title', 'Upload for OCR')">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-500">
          {{ t('expense.uploadForOcr.description', 'Upload the files you want to process with OCR.') }}
        </p>
      </div>
    </div>

    <form class="flex flex-col gap-2 mt-2" :class="isSubmitting ? 'opacity-50' : ''" @submit="onSubmit">
      <FileList v-model:files="draggedFiles" />

      <FileDropZoneSlot v-model:dragged-files="draggedFiles" class="border border-gray-200 rounded-md px-3 py-1 hover:border-dotted hover:border-primary hover:bg-primary/5" :hide-label="true">
        <FileUploadClickable
          v-model:files="draggedFiles"
          :multiple="true"
          @update:files="setFieldValue('files', $event)"
        />
      </FileDropZoneSlot>

      <Alert v-if="errors.files" variant="destructive">
        <AlertDescription>
          {{ errors.files }}
        </AlertDescription>
      </Alert>

      <div class="flex gap-2 items-center justify-end mt-4">
        <Button variant="outline" type="button" @click="isOpen = false">
          {{ t('common.cancel', 'Cancel') }}
        </Button>
        <Button type="submit" :disabled="isSubmitting" :loading="isSubmitting">
          {{ t('expense.uploadForOcr.upload', 'Upload') }}
        </Button>
      </div>
    </form>
  </ModalComponent>
</template>