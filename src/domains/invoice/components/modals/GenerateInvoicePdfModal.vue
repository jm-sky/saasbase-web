<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import { downloadBlob } from '@/lib/downloadBlob'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import { invoiceeAttachmentsService } from '../../services/invoiceAttachmentsService'
import { type IGeneratePdfParams, type IGeneratePdfResponse, invoiceService } from '../../services/invoiceService'
import InvoiceTemplatePicker from '../pickers/InvoiceTemplatePicker.vue'
import type { IInvoice } from '../../types/invoice.type'
import type { IInvoiceTemplatePreview } from '../../types/invoiceTemplate.type'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })
const selectedTemplate = ref<IInvoiceTemplatePreview | undefined>({
  id: '1',
  name: 'Default',
  category: 'invoice',
  isActive: true,
  isDefault: false,
  isSystem: false,
})

const { invoice, download } = defineProps<{
  invoice?: IInvoice | null
  download?: boolean
}>()

const emit = defineEmits<{
  done: []
}>()


const { values, handleSubmit, resetForm, setFieldValue, setErrors, isSubmitting } = useForm<IGeneratePdfParams>({
  initialValues: {
    templateId: undefined,
  }
})

const onSubmit = handleSubmit(async (values: IGeneratePdfParams) => {
  try {
    if (!invoice?.id) return
    const response = await invoiceService.generatePdf(invoice.id, values)
    await optionalDownload(response)
    emit('done')
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('invoice.actions.generatePdf.original.error'), error)
  }
})

const optionalDownload = async (response: IGeneratePdfResponse) => {
  if (!download) return
  if (!invoice?.id) return
  const blob = await invoiceeAttachmentsService.download(invoice.id, response.mediaId)
  downloadBlob(blob, response.fileName)
}

const onSelectTemplate = (template: IInvoiceTemplatePreview | undefined) => {
  if (!template) return
  setFieldValue('templateId', template.id)
  selectedTemplate.value = template
}

watch(open, (isOpen) => {
  if (isOpen) {
    resetForm({
      values: {
        templateId: undefined,
      }
    })
  }
})
</script>

<template>
  <ModalComponent
    v-model:open="open"
    size="lg"
    :title="t('invoice.actions.generatePdf.title')"
    :description="t('invoice.actions.generatePdf.description')"
  >
    <form
      class="grid grid-cols-1 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled name="templateId" :label="t('invoice.actions.generatePdf.fields.template')">
        <InvoiceTemplatePicker
          :id="values?.templateId ?? ''"
          :model-value="selectedTemplate"
          @update:model-value="onSelectTemplate"
        />
      </FormFieldLabeled>

      <Button
        type="submit"
        class="col-span-full"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      >
        {{ t('invoice.actions.generatePdf.title') }}
      </Button>
    </form>
  </ModalComponent>
</template>
