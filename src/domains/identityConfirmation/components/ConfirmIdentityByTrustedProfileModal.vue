<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FileDropZoneSlot from '@/components/Inputs/FileDropZoneSlot.vue'
import FileUploadClickable from '@/components/Inputs/FileUploadClickable.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import { toast } from '@/components/ui/toast'
import { downloadBlob } from '@/lib/downloadBlob'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { identityConfirmationService } from '../services/identityConfirmation.service'

interface IConfirmIdentityByTrustedProfileForm {
  file: File
}

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  done: []
}>()

const draggedFiles = ref<File[]>([])

const { values, errors, setFieldValue, setErrors, handleSubmit, isSubmitting } = useForm<IConfirmIdentityByTrustedProfileForm>({
  initialValues: {
    file: undefined,
  },
})

const onUpdateDraggedFiles = (files: File[]) => {
  draggedFiles.value = files
}

const cancel = () => {
  open.value = false
}

const onDone = () => {
  emit('done')
  open.value = false
}

const setError = () => {
  setErrors({
    file: t('identityConfirmation.trustedProfile.error', 'Błąd podczas wysyłania oświadczenia'),
  })
}

const onSubmit = handleSubmit(async (formData) => {
  try {
    setErrors({})
    const response = await identityConfirmationService.submitSigned(formData)
    if (response.status === 'verified') {
      toast.success(t('identityConfirmation.trustedProfile.success', 'Oświadczenie zostało wysłane'))
      onDone()
    } else {
      setError()
      toast.error(t('identityConfirmation.trustedProfile.error', 'Błąd podczas wysyłania oświadczenia'))
    }
  } catch (error) {
    handleErrorWithToast(t('identityConfirmation.trustedProfile.error', 'Błąd podczas wysyłania oświadczenia'), error)
    setError()
  }
})

const onDownloadXml = async () => {
  const xmlContent = await identityConfirmationService.generateTemplate()
  const blob = new Blob([xmlContent], { type: 'application/xml' })
  downloadBlob(blob, 'template.xml')
}
</script>

<template>
  <ModalComponent
    size="md"
    :title="t('identityConfirmation.trustedProfile.title')"
    :description="t('identityConfirmation.trustedProfile.description')"
    :open="open"
    @update:open="open = $event"
  >
    <div class="flex flex-row justify-between items-center gap-4 border rounded-lg px-4 py-3">
      <div class="font-semibold text-sm">
        {{ t('identityConfirmation.stepOne', 'Step 1') }}
      </div>

      <div class="flex gap-2">
        <Button variant="default" @click="onDownloadXml">
          {{ t('identityConfirmation.trustedProfile.download', 'Download XML') }}
        </Button>
      </div>
    </div>

    <form class="grid grid-cols-2 items-center gap-4 border rounded-lg px-4 py-3" @submit.prevent="onSubmit">
      <div>
        <div class="font-semibold text-sm">
          {{ t('identityConfirmation.stepTwo', 'Step 2') }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ t('identityConfirmation.trustedProfile.uploadSignedXml', 'Upload signed XML') }}
        </div>
      </div>

      <FileDropZoneSlot
        class="p-4 rounded-lg border border-dashed hover:bg-primary-50/50 hover:border-primary"
        :class="errors.file ? 'border-destructive' : 'border-gray-200'"
        :dragged-files="[values.file]"
        hide-label
        @update:dragged-files="onUpdateDraggedFiles"
      >
        <FileUploadClickable
          v-model:files="draggedFiles"
          :error="errors.file"
          @update:files="setFieldValue('file', $event[0])"
        >
          <template v-if="values.file" #icon>
            <Check class="size-4 text-success" />
          </template>
          <template v-if="values.file" #label>
            {{ values.file?.name }}
          </template>
        </FileUploadClickable>
      </FileDropZoneSlot>
      <Button
        type="submit"
        variant="default"
        class="w-full col-span-full"
        :disabled="!values.file"
        :loading="isSubmitting"
      >
        {{ t('common.submit') }}
      </Button>
    </form>

    <Button variant="outline" class="w-full" @click="cancel">
      {{ t('common.cancel') }}
    </Button>
  </ModalComponent>
</template>
