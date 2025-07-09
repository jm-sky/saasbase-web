<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast'
import { contractorService } from '@/domains/contractor/services/ContractorService'
import { useContractorStore } from '@/domains/contractor/store/contractor.store'
import InvoiceTemplateLanguagePicker from '@/domains/invoice/components/invoiceTemplates/InvoiceTemplateLanguagePicker.vue'
import CurrencyPicker from '@/domains/shared/components/CurrencyPicker.vue'
import PaymentMethodPicker from '@/domains/shared/components/PaymentMethodPicker.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractorPreferences, IContractorPreferencesUpdate } from '@/domains/contractor/types/contractor.type'

const { t } = useI18n()
const { toast } = useToast()
const { contractor } = storeToRefs(useContractorStore())

const { handleSubmit, setFieldValue, setErrors, isSubmitting, values } = useForm<IContractorPreferencesUpdate>({
  initialValues: {
    defaultPaymentMethodId: contractor.value?.preferences?.defaultPaymentMethodId ?? '',
    defaultCurrency: contractor.value?.preferences?.defaultCurrency ?? '',
    defaultLanguage: contractor.value?.preferences?.defaultLanguage ?? '',
    defaultPaymentDays: contractor.value?.preferences?.defaultPaymentDays ?? 0,
    defaultTags: contractor.value?.preferences?.defaultTags ?? [],
    defaultPaymentMethod: contractor.value?.preferences?.defaultPaymentMethod ?? {},
  }
})

const onSubmit = handleSubmit(async (formValues) => {
  if (!contractor.value) return

  try {
    const preferences: IContractorPreferences = await contractorService.updatePreferences(contractor.value.id, formValues)
    toast.success(t('contractor.preferences.success'))
    contractor.value.preferences = preferences
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('contractor.preferences.error'), error)
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <form class="flex flex-col gap-4 max-w-md" @submit.prevent="onSubmit">
      <FormFieldLabeled
        name="defaultPaymentMethodId"
        :label="t('contractor.preferences.fields.defaultPaymentMethodId')"
        disabled
      >
        <PaymentMethodPicker
          :model-value="values.defaultPaymentMethod"
          disabled
          @update:model-value="setFieldValue('defaultPaymentMethod', $event)"
          @update:id="setFieldValue('defaultPaymentMethodId', $event)"
        />
      </FormFieldLabeled>
      <FormFieldLabeled
        name="defaultCurrency"
        :label="t('contractor.preferences.fields.defaultCurrency')"
      >
        <CurrencyPicker
          :id="values.defaultCurrency"
          :model-value="{ code: values.defaultCurrency ?? '', name: values.defaultCurrency ?? '', symbol: values.defaultCurrency ?? '' }"
          @update:model-value="setFieldValue('defaultCurrency', $event?.code ?? '')"
        />
      </FormFieldLabeled>
      <FormFieldLabeled
        v-slot="{ componentField }"
        name="defaultLanguage"
        :label="t('contractor.preferences.fields.defaultLanguage')"
      >
        <InvoiceTemplateLanguagePicker
          :model-value="values.defaultLanguage"
          v-bind="componentField"
        />
      </FormFieldLabeled>
      <FormFieldLabeled
        v-slot="{ componentField }"
        name="defaultPaymentDays"
        :label="t('contractor.preferences.fields.defaultPaymentDays')"
      >
        <Input v-bind="componentField" type="number" min="0" />
      </FormFieldLabeled>
      <FormFieldLabeled
        v-slot="{ componentField }"
        name="defaultTags"
        :label="t('contractor.preferences.fields.defaultTags')"
        disabled
      >
        <Input v-bind="componentField" :value="Array.isArray(values.defaultTags) ? values.defaultTags.join(', ') : values.defaultTags" />
      </FormFieldLabeled>

      <Button
        type="submit"
        variant="primary"
        :disabled="isSubmitting"
        :loading="isSubmitting"
      >
        {{ t('common.save') }}
      </Button>
    </form>
  </div>
</template>
