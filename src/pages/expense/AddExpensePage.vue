<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { v4 } from 'uuid'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import DatePicker from '@/components/Inputs/DatePicker.vue'
import EntityDetailsHeader from '@/components/layouts/EntityDetailsHeader.vue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { config } from '@/config'
import { expenseService } from '@/domains/expense/services/expenseService'
import { expenseCreateSchema } from '@/domains/expense/validation/expense.schema'
import { useTenant } from '@/domains/tenant/composables/useTenant'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { fullAddress } from '@/lib/fullAddress'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import ExpensePaymentSection from './partials/ExpensePaymentSection.vue'
import ExpenseSidebarEditable from './partials/ExpenseSidebarEditable.vue'
import InvoiceBuyerBox from './partials/InvoiceBuyerBox.vue'
import InvoiceInfoTable from './partials/InvoiceInfoTable.vue'
import InvoiceLinesEditable from './partials/InvoiceLinesEditable.vue'
import InvoiceSellerBox from './partials/InvoiceSellerBox.vue'
import type { IContractor, IContractorLookup } from '@/domains/contractor/types/contractor.type'
import type { IExpenseCreate } from '@/domains/expense/types/expense.type'
import type { IInvoiceLine } from '@/domains/financial/types/financial.type'
import type { TDate } from '@/domains/shared/types/common'
import type { IPaymentMethod } from '@/domains/shared/types/paymentMethod.type'

const { t } = useI18n()
const { toast } = useToast()
const router = useRouter()
const { tenant, tenantBillingAddress, loadTenant, loadTenantBillingAddress, loadTenantDefaultBankAccount } = useTenant()

const issueDate = ref<TDate | undefined>(new Date().toISOString().split('T')[0])
const seller = ref<IContractor | undefined>(undefined)

const { isSubmitting, handleSubmit, values, setErrors, setFieldValue, resetForm, errors } = useForm<IExpenseCreate>({
  validationSchema: toTypedSchema(expenseCreateSchema),
  initialValues: {
    type: 'basic',
    issueDate: issueDate.value ?? new Date().toISOString().split('T')[0],
    status: 'draft',
    number: 'TEST/0001',
    totalNet: 0,
    totalTax: 0,
    totalGross: 0,
    currency: tenant.value?.prefereces?.currency ?? config.defaults.currency,
    exchangeRate: 1,
    seller: {
      contractorId: undefined,
      contractorType: 'company',
      name: 'DEMO SELLER',
      taxId: undefined,
      address: 'Random street 123',
      country: config.defaults.country,
      iban: undefined,
      email: undefined,
    },
    buyer: {
      contractorId: undefined,
      contractorType: 'company',
      name: tenant.value?.name ?? 'DEMO COMPANY',
      taxId: tenant.value?.taxId ?? undefined,
      address: tenantBillingAddress.value?.street ?? 'OUR ADDRESS',
      country: tenant.value?.country ?? config.defaults.country,
      iban: '',
      email: tenant.value?.email ?? undefined,
    },
    body: {
      lines: [],
      vatSummary: [],
      exchange: {
        currency: config.defaults.currency,
        exchangeRate: 1,
        date: issueDate.value,
      },
    },
    payment: {
      status: 'pending',
      dueDate: undefined,
      method: {
        id: undefined,
        name: 'Bank Transfer',
        paymentDays: config.defaults.paymentDays,
      },
      reference: undefined,
      terms: undefined,
      bankAccount: {
        bankName: undefined,
        iban: undefined,
        swift: undefined,
        country: undefined,
      },
    },
    options: {
      language: 'en',
      template: undefined,
      sendEmail: false,
      emailTo: [],
    },
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

onMounted(async () => {
  tenant.value ??= await loadTenant()
  tenantBillingAddress.value ??= await loadTenantBillingAddress()
  const defaultBankAccount = await loadTenantDefaultBankAccount()

  setFieldValue('buyer.name', tenant.value.name)
  setFieldValue('buyer.taxId', tenant.value.taxId ?? tenant.value.vatId ?? undefined)
  setFieldValue('buyer.address', tenantBillingAddress.value?.street ? fullAddress(tenantBillingAddress.value) : 'OUR ADDRESS')
  setFieldValue('buyer.country', tenant.value.country ?? 'PL')
  setFieldValue('buyer.email', tenant.value.email ?? undefined)

  // Initialize bank account from tenant default
  if (defaultBankAccount) {
    setFieldValue('payment.bankAccount.iban', defaultBankAccount.iban)
    setFieldValue('payment.bankAccount.swift', defaultBankAccount.swift ?? undefined)
    setFieldValue('payment.bankAccount.bankName', defaultBankAccount.bankName)
    setFieldValue('payment.bankAccount.country', defaultBankAccount.country)
  }

  addLine()
})

const onSubmit = handleSubmit(async (values) => {
  try {
    values.body.lines = values.body.lines.filter((line: IInvoiceLine) => line.description)
    const expense = await expenseService.create(values)
    toast.success(t('expense.add.success', 'Expense added successfully'))
    resetForm()
    await router.push(`/expenses/${expense.id}/show`)
  } catch (error: unknown) {
    console.error('[AddExpensePage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('expense.add.error', 'Could not add expense'), error)
  }
})

const onSellerUpdate = (contractor: IContractorLookup | undefined) => {
  if (!contractor) return
  setFieldValue('seller.contractorId', contractor.id)
  setFieldValue('seller.name', contractor.name)
  setFieldValue('seller.taxId', contractor.taxId ?? contractor.vatId ?? '')
  setFieldValue('seller.address', contractor.defaultAddress?.street ?? '...')
}

const onPaymentMethodUpdate = (paymentMethod: IPaymentMethod | undefined) => {
  if (!paymentMethod) return

  // Update the payment method
  setFieldValue('payment.method', paymentMethod)

  // Calculate due date based on payment days
  if (paymentMethod.paymentDays && paymentMethod.paymentDays > 0 && values.issueDate) {
    const issueDate = new Date(values.issueDate)
    const dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + paymentMethod.paymentDays)
    setFieldValue('payment.dueDate', dueDate.toISOString().split('T')[0])
  }
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
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsHeader
      :title="t('expense.add.title')"
      :back-link-text="t('expense.title')"
      back-link="/expenses"
      padded
    />

    <div class="flex flex-row gap-8 lg:mx-6">
      <form class="w-full lg:w-7xl mx-auto p-2 sm:p-4 md:p-8 border shadow-xl/30" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <div class="border-b border-r p-2 sm:p-4 md:p-6">
            <div class="text-5xl font-bold py-4 mb-2">
              {{ t(`financial.invoiceType.${values.type}`) }}
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-6 border-primary px-2 sm:px-4 py-2 font-semibold text-muted-foreground">
              <div>
                <FormFieldLabeled v-slot="{ componentField }" name="number" :disabled="isSubmitting">
                  <Input v-bind="componentField" />
                </FormFieldLabeled>
              </div>
              <DatePicker :model-value="values.issueDate" @update:model-value="(value) => setFieldValue('issueDate', value ?? values.issueDate)" />
            </div>

            <InvoiceInfoTable :values="values" />
          </div>

          <InvoiceSellerBox v-model="seller" :values="values" :on-seller-update="onSellerUpdate" />
          <div class="border-r p-6">
            <div class="text-muted-foreground text-sm">
              Terms & Notes
            </div>
          </div>
          <InvoiceBuyerBox :values="values" />
        </div>

        <InvoiceLinesEditable
          :values="values"
          :add-line="addLine"
        />

        <Separator class="my-8" />

        <div class="grid grid-cols-1 gap-8">
          <ExpensePaymentSection :values="values" />
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
            {{ t('expense.add.submit', 'Save Expense') }}
          </Button>
        </div>
      </form>

      <ExpenseSidebarEditable
        :values="values"
        :reset-form="resetForm"
        :is-submitting="isSubmitting"
        @update-payment-method-object="onPaymentMethodUpdate"
        @update-payment-status="setFieldValue('payment.status', $event as any)"
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

