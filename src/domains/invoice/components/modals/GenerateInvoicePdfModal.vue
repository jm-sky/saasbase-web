<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IInvoice } from '../../types/invoice.type'
import type { IInvoiceTemplatePreview } from '../../types/invoiceTemplate.type'
import { type IGeneratePdfParams, invoiceService } from '../../services/invoiceService'
import InvoiceTemplatePicker from '../InvoiceTemplatePicker.vue'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })
const selectedTemplate = ref<IInvoiceTemplatePreview | undefined>({
  id: '1',
  name: 'Original',
  category: 'invoice',
  settings: {},
  isActive: true,
  isDefault: false,
})

const { invoice } = defineProps<{
  invoice?: IInvoice | null
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
    await invoiceService.generatePdf(invoice.id, values)
    emit('done')
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('invoice.actions.generatePdf.original.error'), error)
  }
})

const onSelectTemplate = (template: IInvoiceTemplatePreview) => {
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
      <FormFieldLabeled
        name="templateId"
        :label="t('invoice.actions.generatePdf.fields.template')"
      >
        <InvoiceTemplatePicker
          :id="values?.templateId ?? ''"
          :model-value="selectedTemplate"
          @select="onSelectTemplate"
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
