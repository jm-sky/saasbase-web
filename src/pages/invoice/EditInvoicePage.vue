<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { v4 } from 'uuid'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import DatePicker from '@/components/Inputs/DatePicker.vue'
import EntityDetailsHeader from '@/components/layouts/EntityDetailsHeader.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertDescription from '@/components/ui/alert/AlertDescription.vue'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { config } from '@/config'
import NumberingTemplatePicker from '@/domains/invoice/components/pickers/NumberingTemplatePicker.vue'
import { invoiceService } from '@/domains/invoice/services/invoiceService'
import { useInvoiceStore } from '@/domains/invoice/stores/invoice.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import InvoiceBuyerBox from './partials/InvoiceBuyerBox.vue'
import InvoiceInfoTable from './partials/InvoiceInfoTable.vue'
import InvoiceLinesEditable from './partials/InvoiceLinesEditable.vue'
import InvoicePaymentSection from './partials/InvoicePaymentSection.vue'
import InvoiceSellerBox from './partials/InvoiceSellerBox.vue'
import InvoiceSidebarEditable from './partials/InvoiceSidebarEditable.vue'
import type { IContractor, IContractorLookup } from '@/domains/contractor/types/contractor.type'
import type { IInvoiceLine } from '@/domains/financial/types/financial.type'
import type { IInvoice } from '@/domains/invoice/types/invoice.type'
import type { IPaymentMethod } from '@/domains/shared/types/paymentMethod.type'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const invoiceStore = useInvoiceStore()
const { invoice } = storeToRefs(invoiceStore)

const buyer = ref<IContractor | undefined>(undefined)

const invoiceId = route.params.id as string
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const { values, isSubmitting, handleSubmit, errors, setValues, setFieldValue, setErrors, resetForm } = useForm<Omit<IInvoice, 'id' | 'createdAt' | 'updatedAt'>>({
  initialValues: {
    number: invoice.value?.number ?? '',
    type: invoice.value?.type ?? 'basic',
    status: invoice.value?.status ?? 'draft',
    numberingTemplateId: invoice.value?.numberingTemplateId ?? '',
    totalNet: invoice.value?.totalNet ?? 0,
    totalTax: invoice.value?.totalTax ?? 0,
    totalGross: invoice.value?.totalGross ?? 0,
    currency: invoice.value?.currency ?? 'PLN',
    exchangeRate: invoice.value?.exchangeRate ?? 1,
    seller: {
      contractorId: invoice.value?.seller.contractorId ?? undefined,
      contractorType: invoice.value?.seller.contractorType ?? undefined,
      name: invoice.value?.seller.name ?? undefined,
      taxId: invoice.value?.seller.taxId ?? undefined,
      address: invoice.value?.seller.address ?? undefined,
      country: invoice.value?.seller.country ?? undefined,
      iban: invoice.value?.seller.iban ?? undefined,
      email: invoice.value?.seller.email ?? undefined,
    },
    buyer: {
      contractorId: invoice.value?.buyer.contractorId ?? undefined,
      contractorType: invoice.value?.buyer.contractorType ?? undefined,
      name: invoice.value?.buyer.name ?? undefined,
      taxId: invoice.value?.buyer.taxId ?? undefined,
      address: invoice.value?.buyer.address ?? undefined,
      country: invoice.value?.buyer.country ?? undefined,
      iban: invoice.value?.buyer.iban ?? undefined,
      email: invoice.value?.buyer.email ?? undefined,
    },
    body: {
      lines: invoice.value?.body.lines ?? [],
      vatSummary: invoice.value?.body.vatSummary ?? [],
      exchange: {
        currency: invoice.value?.body.exchange.currency ?? config.defaults.currency,
        exchangeRate: invoice.value?.body.exchange.exchangeRate ?? 1,
        date: invoice.value?.body.exchange.date ?? '',
      },
    },
    payment: {
      status: invoice.value?.payment.status ?? 'pending',
      dueDate: invoice.value?.payment.dueDate ?? '',
      paidDate: invoice.value?.payment.paidDate ?? '',
      paidAmount: invoice.value?.payment.paidAmount ?? 0,
      method: {
        id: invoice.value?.payment.method.id ?? '',
        name: invoice.value?.payment.method.name ?? 'Bank Transfer',
        paymentDays: invoice.value?.payment.method.paymentDays ?? 0,
      },
      reference: invoice.value?.payment.reference ?? '',
      terms: invoice.value?.payment.terms ?? '',
      notes: invoice.value?.payment.notes ?? '',
    },
    options: {
      language: invoice.value?.options.language ?? 'en',
      template: invoice.value?.options.template ?? '',
      sendEmail: invoice.value?.options.sendEmail ?? false,
      emailTo: invoice.value?.options.emailTo ?? [],
    },
    issueDate: invoice.value?.issueDate ?? '',
    numberingTemplate: invoice.value?.numberingTemplate ?? undefined,
  },
})

const createLine = (): IInvoiceLine => {
  return {
    id: v4(),
    description: '',
    quantity: 1,
    unitPrice: 0,
    vatRate: {
      id: '23%',
      name: '23%',
      rate: 23,
      type: 'percentage',
    },
    totalNet: 0,
    totalVat: 0,
    totalGross: 0,
    productId: null,
    gtuCodes: [],
  }
}

const addLine = () => {
  setFieldValue('body.lines', [...values.body.lines, createLine()])
}

const formErrors = computed(() => {
  const errorMessages: string[] = []

  // Convert nested errors to flat array of messages
  const flattenErrors = (obj: Record<string, unknown>, prefix = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'string') {
        errorMessages.push(`${fullKey}: ${value}`)
      } else if (value && typeof value === 'object') {
        // @ts-expect-error - value is an object
        flattenErrors(value, fullKey)
      }
    })
  }

  flattenErrors(errors.value)

  return errorMessages
})

const refresh = async () => {
  try {
    loading.value = true
    errorMessage.value = null
    const response = await invoiceService.get(invoiceId)
    invoice.value = response
    setValues(response)
  } catch (err) {
    handleErrorWithToast(t('invoice.show.error', 'Error'), err)
    errorMessage.value = t('invoice.show.error', 'Failed to load invoice')
  } finally {
    loading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await invoiceService.update(invoiceId, values)
    toast.success(t('invoice.edit.success', 'Invoice updated successfully'))
    resetForm()
    await router.push(`/invoices/${invoiceId}/show/overview`)
  } catch (error: unknown) {
    console.error('[EditInvoicePage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('invoice.edit.error', 'Could not edit invoice'), error)
  }
})

const onBuyerUpdate = (contractor: IContractorLookup | undefined) => {
  if (!contractor) return
  setFieldValue('buyer.contractorId', contractor.id)
  setFieldValue('buyer.name', contractor.name)
  setFieldValue('buyer.taxId', contractor.taxId ?? contractor.vatId ?? '')
  setFieldValue('buyer.address', contractor.defaultAddress?.street ?? '...')
}

const onPaymentMethodUpdate = (paymentMethod: IPaymentMethod | undefined) => {
  if (!paymentMethod) return

  // Calculate due date based on payment days
  if (paymentMethod.paymentDays && paymentMethod.paymentDays > 0) {
    const issueDate = values.issueDate ? new Date(values.issueDate) : new Date()
    const dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + paymentMethod.paymentDays)
    setFieldValue('payment.dueDate', dueDate.toISOString().split('T')[0])
  }
}

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsHeader
      :title="t('invoice.edit.title')"
      :back-link-text="t('invoice.title')"
      back-link="/invoices"
      padded
    >
      <template #actions-left>
        <ButtonLink variant="primary" :to="`/invoices/${invoiceId}/show`">
          {{ t('common.back') }}
        </ButtonLink>
      </template>
    </EntityDetailsHeader>

    <div class="flex flex-row gap-8 lg:mx-6">
      <form class="w-full lg:w-7xl mx-auto p-2 sm:p-4 md:p-8 border shadow-xl/30" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <div class="border-b border-r p-2 sm:p-4 md:p-6">
            <div class="text-5xl font-bold py-4 mb-2">
              {{ t(`financial.invoiceType.${values.type}`) }}
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-6 border-primary px-2 sm:px-4 py-2 font-semibold text-muted-foreground">
              <div>
                <FormFieldLabeled name="numberingTemplateId" :disabled="isSubmitting">
                  <div class="flex flex-row items-center gap-4">
                    {{ values.number }}
                    <NumberingTemplatePicker
                      :id="values.numberingTemplateId"
                      :model-value="values.numberingTemplate"
                      :invoice-type="values.type"
                      pick-first-template
                      class="w-56"
                      @update:model-value="setFieldValue('numberingTemplate', $event)"
                      @update:id="setFieldValue('numberingTemplateId', $event ?? '')"
                    />
                  </div>
                </FormFieldLabeled>
              </div>
              <DatePicker :model-value="values.issueDate" @update:model-value="(value) => setFieldValue('issueDate', value ?? values.issueDate)" />
            </div>

            <InvoiceInfoTable :values="values" />
          </div>

          <InvoiceSellerBox :values="values" />
          <div class="border-r p-6">
            <div class="text-muted-foreground text-sm">
              Terms & Notes
            </div>
          </div>
          <InvoiceBuyerBox v-model="buyer" :values="values" :on-buyer-update="onBuyerUpdate" />
        </div>

        <InvoiceLinesEditable
          :values="values"
          :add-line="addLine"
        />

        <Separator class="my-8" />

        <div class="grid grid-cols-1 gap-8">
          <InvoicePaymentSection :values="values" />
        </div>

        <Separator class="my-8" />

        <!-- Form Validation Errors -->
        <Alert v-if="formErrors.length > 0" variant="destructive" class="mb-4">
          <AlertDescription>
            <div class="text-sm">
              <div class="font-medium mb-2">
                {{ t('common.form.validationErrors', 'Please fix the following errors:') }}
              </div>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="error in formErrors" :key="error">
                  {{ error }}
                </li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        <div class="mr-2 flex justify-end gap-2">
          <Button variant="outline" @click="resetForm">
            {{ t('common.cancel', 'Cancel') }}
          </Button>
          <Button type="submit" variant="primary" :disabled="isSubmitting">
            {{ t('invoice.add.submit', 'Save Invoice') }}
          </Button>
        </div>
      </form>

      <InvoiceSidebarEditable
        :values="values"
        :reset-form="resetForm"
        :is-submitting="isSubmitting"
        @update-payment-method="setFieldValue('payment.method', $event ?? values.payment.method)"
        @update-payment-method-object="onPaymentMethodUpdate"
        @update-payment-status="setFieldValue('payment.status', $event ?? values.payment.status)"
        @update-payment-due-date="setFieldValue('payment.dueDate', $event)"
        @update-payment-reference="setFieldValue('payment.reference', $event)"
        @update-payment-terms="setFieldValue('payment.terms', $event)"
        @update-currency="setFieldValue('currency', $event)"
        @update-exchange-date="setFieldValue('body.exchange.date', $event)"
        @update-send-email="setFieldValue('options.sendEmail', $event)"
        @update-email-to="setFieldValue('options.emailTo', $event)"
      />
    </div>
  </AuthenticatedLayout>
</template>

