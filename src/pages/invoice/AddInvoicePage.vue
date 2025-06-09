<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { invoiceService } from '@/domains/invoice/services/invoiceService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IInvoice } from '@/domains/invoice/types/invoice.type'

const { t } = useI18n()
const router = useRouter()
const { toast } = useToast()

const { isSubmitting, handleSubmit, setErrors, resetForm } = useForm<Omit<IInvoice, 'id' | 'createdAt' | 'updatedAt'>>({
  initialValues: {
    number: 'TEST/0001',
    type: 'basic',
    status: 'draft',
    numberingTemplateId: '',
    totalNet: 0,
    totalTax: 0,
    totalGross: 0,
    currency: 'PLN',
    exchangeRate: 1,
    seller: {
      contractorId: 0,
      contractorType: '',
      name: '',
      taxId: '',
      address: '',
      country: '',
      iban: '',
      email: '',
    },
    buyer: {
      contractorId: 0,
      contractorType: '',
      name: '',
      taxId: '',
      address: '',
      country: '',
      iban: '',
      email: '',
    },
    data: {
      lines: [],
      vatSummary: [],
      exchange: {
        currency: 'PLN',
        exchangeRate: 1,
        date: '',
      },
    },
    payment: {
      status: 'pending',
      dueDate: '',
      paidDate: null,
      paidAmount: 0,
      method: 'bankTransfer',
      reference: '',
      terms: '',
      notes: null,
    },
    options: {
      language: 'en',
      template: '',
      sendEmail: false,
      emailTo: [],
    },
    issueDate: '2025-01-01',
    numberingTemplate: undefined,
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const invoice = await invoiceService.create(values)
    toast.success(t('invoice.add.success', 'Invoice added successfully'))
    resetForm()
    await router.push(`/invoices/${invoice.id}/show/overview`)
  } catch (error: unknown) {
    console.error('[AddInvoicePage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('invoice.add.error', 'Could not add invoice'), error)
  }
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="m-6 p-6 md:p-8 border rounded-md shadow-lg">
      <form class="flex flex-col gap-y-2 gap-x-8" @submit.prevent="onSubmit">
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="number"
          :label="t('invoice.fields.number', 'Number')"
          :disabled="isSubmitting"
        >
          <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="issueDate"
          :label="t('invoice.fields.issueDate', 'issueDate')"
          :disabled="isSubmitting"
        >
          <Input type="date" v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="type"
          :label="t('invoice.fields.type', 'Type')"
          :disabled="isSubmitting"
        >
          <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="status"
          :label="t('invoice.fields.status', 'Status')"
          :disabled="isSubmitting"
        >
          <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="currency"
          :label="t('invoice.fields.currency', 'Currency')"
          :disabled="isSubmitting"
        >
          <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
        </FormFieldLabeled>
        <div class="col-span-2">
          <Button type="submit" :disabled="isSubmitting" class="w-full">
            {{ t('invoice.add.title', 'Add Invoice') }}
          </Button>
        </div>
      </form>
    </div>
  </AuthenticatedLayout>
</template>

