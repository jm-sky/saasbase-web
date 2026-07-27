<script setup lang="ts">
import { isAxiosError } from 'axios'
import { Check } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FileDropZoneSlot from '@/components/Inputs/FileDropZoneSlot.vue'
import FileUploadClickable from '@/components/Inputs/FileUploadClickable.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import { FormField } from '@/components/ui/form'
import FormItem from '@/components/ui/form/FormItem.vue'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { downloadBlob } from '@/lib/downloadBlob'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import { identityConfirmationService } from '../services/identityConfirmation.service'
import SignatureInfoSection from './SignatureInfoSection.vue'
import SignatureInfoSectionItem from './SignatureInfoSectionItem.vue'
import type { IIdentityConfirmationResponse } from '../types/identityConfirmation.type'

interface IConfirmIdentityByTrustedProfileForm {
  file: File
}

const { t } = useI18n()
const authStore = useAuthStore()

const open = defineModel<boolean>('open', { required: true })

const draggedFiles = ref<File[]>([])
const response = ref<IIdentityConfirmationResponse | null>(null)

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

const setError = (message?: string) => {
  setErrors({
    file: message ?? t('identityConfirmation.trustedProfile.error'),
  })
}

const onSubmit = handleSubmit(async (formData) => {
  try {
    setErrors({})
    const resp = await identityConfirmationService.submitSigned(formData)
    response.value = resp
    if (resp.status === 'verified') {
      toast.success(t('identityConfirmation.trustedProfile.success', 'Oświadczenie zostało wysłane'))
    } else {
      setError(t('identityConfirmation.trustedProfile.notVerifiedError'))
    }
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    if (isAxiosError(error) && error.response) response.value = error.response.data
    handleErrorWithToast(t('identityConfirmation.trustedProfile.error'), error)
  }
})

const onDownloadXml = async () => {
  const xmlContent = await identityConfirmationService.generateTemplate()
  const blob = new Blob([xmlContent], { type: 'application/xml' })
  downloadBlob(blob, `${authStore.user?.fullName}-identity-confirmation.xml`.replaceAll(' ', '-').toLowerCase())
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

    <form class="border rounded-lg px-4 py-3 space-y-2" @submit.prevent="onSubmit">
      <FormField name="file">
        <FormItem class="grid grid-cols-2 items-center gap-x-4 gap-y-1">
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

          <FormMessage class="col-span-full" />
        </FormItem>
      </FormField>

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

    <div v-if="response && response.signatureInfo" class="border rounded-lg px-4 py-3 grid grid-cols-[1fr_2fr] gap-2 text-sm">
      <div class="font-semibold">
        {{ t('identityConfirmation.trustedProfile.fields.status') }}
      </div>

      <div class="mb-2">
        {{ t(`identityConfirmation.trustedProfile.status.${response.status}`) }}
      </div>

      <SignatureInfoSection :label="t('identityConfirmation.trustedProfile.fields.signer')">
        <SignatureInfoSectionItem :label="t('identityConfirmation.trustedProfile.signatureInfo.name')" :value="response.signatureInfo.signerIdentity?.firstName" />
        <SignatureInfoSectionItem :label="t('identityConfirmation.trustedProfile.signatureInfo.lastName')" :value="response.signatureInfo.signerIdentity?.lastName" />
        <SignatureInfoSectionItem :label="t('identityConfirmation.trustedProfile.signatureInfo.pesel')" :value="response.signatureInfo.signerIdentity?.pesel" />
      </SignatureInfoSection>

      <SignatureInfoSection :label="t('identityConfirmation.trustedProfile.fields.certificate')">
        <SignatureInfoSectionItem :label="t('identityConfirmation.trustedProfile.signatureInfo.issuer')" :value="response.signatureInfo.certificate?.issuer" />
        <SignatureInfoSectionItem :label="t('identityConfirmation.trustedProfile.signatureInfo.subject')" :value="response.signatureInfo.certificate?.subject" />
      </SignatureInfoSection>
    </div>

    <Button variant="outline" class="w-full" @click="cancel">
      {{ t('common.cancel') }}
    </Button>
  </ModalComponent>
</template>
