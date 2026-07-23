<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import TagsInputField from '@/components/ui/tags-input/TagsInputField.vue'
import { useToast } from '@/components/ui/toast'
import { useUpdateContractorPreferences } from '@/domains/contractor/composables/useContractorMutations'
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
const { mutateAsync: updatePreferences } = useUpdateContractorPreferences()

const { handleSubmit, setFieldValue, setErrors, isSubmitting, values } = useForm<IContractorPreferencesUpdate>({
  initialValues: {
    defaultPaymentMethod: contractor.value?.preferences?.defaultPaymentMethod ?? undefined,
    defaultPaymentMethodId: contractor.value?.preferences?.defaultPaymentMethodId ?? undefined,
    defaultCurrency: contractor.value?.preferences?.defaultCurrency ?? undefined,
    defaultCurrencyCode: contractor.value?.preferences?.defaultCurrencyCode ?? undefined,
    defaultLanguage: contractor.value?.preferences?.defaultLanguage ?? undefined,
    defaultPaymentDays: contractor.value?.preferences?.defaultPaymentDays ?? undefined,
    defaultTags: contractor.value?.preferences?.defaultTags ?? [],
  }
})

const onSubmit = handleSubmit(async (formValues) => {
  if (!contractor.value) return

  try {
    const preferences: IContractorPreferences = await updatePreferences({ id: contractor.value.id, data: formValues })
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
    <form class="flex flex-col gap-8 max-w-md" :class="{ 'opacity-50': isSubmitting }" @submit.prevent="onSubmit">
      <FormFieldLabeled
        name="defaultPaymentMethodId"
        :label="t('contractor.preferences.fields.defaultPaymentMethodId')"
        :description="t('contractor.preferences.fields.defaultPaymentMethodIdDescription')"
      >
        <PaymentMethodPicker
          clearable
          :model-value="values.defaultPaymentMethod"
          @update:model-value="setFieldValue('defaultPaymentMethod', $event)"
          @update:id="setFieldValue('defaultPaymentMethodId', $event)"
        />
      </FormFieldLabeled>
      <FormFieldLabeled
        name="defaultCurrency"
        :label="t('contractor.preferences.fields.defaultCurrency')"
      >
        <CurrencyPicker
          clearable
          :model-value="values.defaultCurrency"
          @update:model-value="setFieldValue('defaultCurrency', $event)"
          @update:id="setFieldValue('defaultCurrencyCode', $event)"
        />
      </FormFieldLabeled>
      <FormFieldLabeled
        v-slot="{ componentField }"
        name="defaultLanguage"
        :label="t('contractor.preferences.fields.defaultLanguage')"
        :description="t('contractor.preferences.fields.defaultLanguageDescription')"
      >
        <InvoiceTemplateLanguagePicker
          clearable
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
        name="defaultTags"
        :label="t('contractor.preferences.fields.defaultTags')"
        disabled
      >
        <TagsInputField
          :model-value="values.defaultTags ?? []"
          @update:model-value="setFieldValue('defaultTags', $event)"
        />
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
