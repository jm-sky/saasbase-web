<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
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
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { config } from '@/config'
import { expenseService } from '@/domains/expense/services/expenseService'
import { useExpenseStore } from '@/domains/expense/stores/expense.store'
import { expenseCreateSchema } from '@/domains/expense/validation/expense.schema'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
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
import type { IPaymentMethod } from '@/domains/shared/types/paymentMethod.type'

const { t } = useI18n()
const { toast } = useToast()
const route = useRoute()
const router = useRouter()

const expenseStore = useExpenseStore()
const { expense } = storeToRefs(expenseStore)

const seller = ref<IContractor | undefined>(undefined)

const expenseId = route.params.id as string
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const { values, isSubmitting, handleSubmit, errors, setValues, setFieldValue, setErrors, resetForm } = useForm<IExpenseCreate>({
  validationSchema: toTypedSchema(expenseCreateSchema),
  initialValues: {
    type: expense.value?.type ?? 'basic',
    issueDate: expense.value?.issueDate ?? new Date().toISOString().split('T')[0],
    status: expense.value?.status ?? 'draft',
    number: expense.value?.number ?? '',
    totalNet: expense.value?.totalNet ?? 0,
    totalTax: expense.value?.totalTax ?? 0,
    totalGross: expense.value?.totalGross ?? 0,
    currency: expense.value?.currency ?? config.defaults.currency,
    exchangeRate: expense.value?.exchangeRate ?? 1,
    seller: {
      contractorId: expense.value?.seller.contractorId ?? undefined,
      contractorType: expense.value?.seller.contractorType ?? 'company',
      name: expense.value?.seller.name ?? 'DEMO SELLER',
      taxId: expense.value?.seller.taxId ?? undefined,
      address: expense.value?.seller.address ?? 'Random street 123',
      country: expense.value?.seller.country ?? config.defaults.country,
      iban: expense.value?.seller.iban ?? undefined,
      email: expense.value?.seller.email ?? undefined,
    },
    buyer: {
      contractorId: expense.value?.buyer.contractorId ?? undefined,
      contractorType: expense.value?.buyer.contractorType ?? 'company',
      name: expense.value?.buyer.name ?? 'DEMO COMPANY',
      taxId: expense.value?.buyer.taxId ?? undefined,
      address: expense.value?.buyer.address ?? 'OUR ADDRESS',
      country: expense.value?.buyer.country ?? config.defaults.country,
      iban: expense.value?.buyer.iban ?? '',
      email: expense.value?.buyer.email ?? undefined,
    },
    body: {
      lines: expense.value?.body.lines ?? [],
      vatSummary: expense.value?.body.vatSummary ?? [],
      exchange: {
        currency: expense.value?.body.exchange.currency ?? config.defaults.currency,
        exchangeRate: expense.value?.body.exchange.exchangeRate ?? 1,
        date: expense.value?.body.exchange.date ?? new Date().toISOString().split('T')[0],
      },
    },
    payment: {
      status: expense.value?.payment.status ?? 'pending',
      dueDate: expense.value?.payment.dueDate ?? undefined,
      method: {
        id: expense.value?.payment.method.id ?? undefined,
        name: expense.value?.payment.method.name ?? 'Bank Transfer',
        paymentDays: expense.value?.payment.method.paymentDays ?? config.defaults.paymentDays,
      },
      reference: expense.value?.payment.reference ?? undefined,
      terms: expense.value?.payment.terms ?? undefined,
      bankAccount: {
        bankName: expense.value?.payment.bankAccount?.bankName ?? undefined,
        iban: expense.value?.payment.bankAccount?.iban ?? undefined,
        swift: expense.value?.payment.bankAccount?.swift ?? undefined,
        country: expense.value?.payment.bankAccount?.country ?? undefined,
      },
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
    const response = await expenseService.get(expenseId)
    expense.value = response
    setValues(response)
  } catch (err) {
    handleErrorWithToast(t('expense.show.error', 'Error'), err)
    errorMessage.value = t('expense.show.error', 'Failed to load expense')
  } finally {
    loading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    values.body.lines = values.body.lines.filter((line: IInvoiceLine) => line.description)
    await expenseService.update(expenseId, values)
    toast.success(t('expense.edit.success', 'Expense updated successfully'))
    await router.push(`/expenses/${expenseId}/show`)
  } catch (error: unknown) {
    console.error('[EditExpensePage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('expense.edit.error', 'Could not update expense'), error)
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

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsHeader
      :title="t('expense.edit.title', 'Edit Expense')"
      :back-link-text="t('expense.title')"
      back-link="/expenses"
      padded
    >
      <template #actions-left>
        <ButtonLink variant="primary" :to="`/expenses/${expenseId}/show`">
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
            {{ t('expense.edit.submit', 'Update Expense') }}
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
      />
    </div>
  </AuthenticatedLayout>
</template>

