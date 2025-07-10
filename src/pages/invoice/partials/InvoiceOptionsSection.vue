<script setup lang="ts">
import { useFormContext } from 'vee-validate'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InvoiceTemplateLanguagePicker from '@/domains/invoice/components/invoiceTemplates/InvoiceTemplateLanguagePicker.vue'
import InvoiceTemplatePicker from '@/domains/invoice/components/pickers/InvoiceTemplatePicker.vue'
import type { IContractorPreferences } from '@/domains/contractor/types/contractor.type'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'
import type { IInvoiceTemplatePreview } from '@/domains/invoice/types/invoiceTemplate.type'

const { t, locale } = useI18n()
const { setFieldValue } = useFormContext<IInvoiceCreate>()

const props = defineProps<{
  values: IInvoiceCreate
}>()

const invoiceTemplatePreview = ref<IInvoiceTemplatePreview | undefined>({
  id: props.values.options.template ?? '',
  name: props.values.options.template ?? '',
  category: 'invoice',
  isActive: true,
  isDefault: false,
  isSystem: false,
})

// Smart language defaulting
const getDefaultLanguage = () => {
  // Priority: buyer's preference > current locale
  const buyerPreference: IContractorPreferences | undefined = props.values.buyer.contractorId ?
    // In real implementation, you would fetch contractor preferences here
    // For now, we'll use a placeholder
    {} as IContractorPreferences : undefined

  return buyerPreference?.defaultLanguage ?? locale.value
}

// Watch for buyer changes to update language
watch(() => props.values.buyer.contractorId, (newBuyerId) => {
  if (newBuyerId) {
    // When buyer changes, update language to their preference or current locale
    const defaultLang = getDefaultLanguage()
    setFieldValue('options.language', defaultLang)
  }
}, { immediate: false })

const newEmailAddress = ref('')

const addEmailAddress = () => {
  if (newEmailAddress.value && !props.values.options.emailTo.includes(newEmailAddress.value)) {
    const updatedEmails = [...props.values.options.emailTo, newEmailAddress.value]
    setFieldValue('options.emailTo', updatedEmails)
    newEmailAddress.value = ''
  }
}

const removeEmailAddress = (index: number) => {
  const updatedEmails = props.values.options.emailTo.filter((_, i) => i !== index)
  setFieldValue('options.emailTo', updatedEmails)
}

const onSendEmailChange = (checked: boolean) => {
  setFieldValue('options.sendEmail', checked)
  if (!checked) {
    setFieldValue('options.emailTo', [])
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-lg font-semibold">
      {{ t('financial.options.title', 'Invoice Options') }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormFieldLabeled name="options.language" :label="t('financial.options.language', 'Language')">
        <InvoiceTemplateLanguagePicker
          :model-value="values.options.language"
          @update:model-value="(value) => setFieldValue('options.language', value)"
        />
      </FormFieldLabeled>

      <FormFieldLabeled name="options.template" :label="t('financial.options.template', 'Template')">
        <InvoiceTemplatePicker
          v-model="invoiceTemplatePreview"
          class="w-full"
          @update:model-value="(value) => setFieldValue('options.template', value?.name)"
        />
      </FormFieldLabeled>
    </div>

    <!-- Email Options -->
    <div class="space-y-4">
      <div class="flex items-center space-x-2">
        <Checkbox
          :model-value="values.options.sendEmail"
          @update:model-value="(value) => onSendEmailChange(value as boolean)"
        />
        <Label for="sendEmail">
          {{ t('financial.options.sendEmail', 'Send email notification') }}
        </Label>
      </div>

      <div v-if="values.options.sendEmail" class="space-y-4 p-4 border rounded-lg bg-muted/50">
        <div class="font-medium">
          {{ t('financial.options.emailSettings', 'Email Settings') }}
        </div>

        <!-- Email Addresses List -->
        <div v-if="values.options.emailTo.length > 0" class="space-y-2">
          <Label>{{ t('financial.options.emailTo', 'Send to:') }}</Label>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(email, index) in values.options.emailTo"
              :key="index"
              class="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm"
            >
              <span>{{ email }}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                @click="removeEmailAddress(index)"
              >
                ×
              </Button>
            </div>
          </div>
        </div>

        <!-- Add Email Address -->
        <div class="flex gap-2">
          <Input
            v-model="newEmailAddress"
            type="email"
            :placeholder="t('financial.options.emailPlaceholder', 'Enter email address')"
            class="flex-1"
            @keyup.enter="addEmailAddress"
          />
          <Button
            type="button"
            variant="outline"
            @click="addEmailAddress"
          >
            {{ t('common.add', 'Add') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
