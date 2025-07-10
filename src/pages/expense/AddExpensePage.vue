<script setup lang="ts">
import { v4 } from 'uuid'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import DatePicker from '@/components/Inputs/DatePicker.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { expenseService } from '@/domains/expense/services/expenseService'
import { useTenant } from '@/domains/tenant/composables/useTenant'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { fullAddress } from '@/lib/fullAddress'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import AddInvoiceSidebar from './partials/AddInvoiceSidebar.vue'
import InvoiceBuyerBox from './partials/InvoiceBuyerBox.vue'
import InvoiceInfoTable from './partials/InvoiceInfoTable.vue'
import InvoiceLinesEditable from './partials/InvoiceLinesEditable.vue'
import InvoiceSellerBox from './partials/InvoiceSellerBox.vue'
import type { IContractor, IContractorLookup } from '@/domains/contractor/types/contractor.type'
import type { IExpenseCreate } from '@/domains/expense/types/expense.type'
import type { IInvoiceLine } from '@/domains/financial/types/financial.type'
import type { TDate } from '@/domains/shared/types/common'

const { t } = useI18n()
const { toast } = useToast()
const router = useRouter()
const { tenant, tenantBillingAddress, loadTenant, loadTenantBillingAddress } = useTenant()

const issueDate = ref<TDate | undefined>(new Date().toISOString().split('T')[0])
const seller = ref<IContractor | undefined>(undefined)

const { isSubmitting, handleSubmit, values, setErrors, setFieldValue, resetForm } = useForm<IExpenseCreate>({
  initialValues: {
    number: 'TEST/0001',
    type: 'basic',
    status: 'draft',
    totalNet: 0,
    totalTax: 0,
    totalGross: 0,
    currency: 'PLN',
    exchangeRate: 1,
    seller: {
      contractorId: undefined,
      contractorType: 'company',
      name: tenant.value?.name ?? 'DEMO COMPANY',
      taxId: tenant.value?.taxId ?? '',
      address: tenantBillingAddress.value?.street ?? 'OUR ADDRESS',
      country: tenant.value?.country ?? 'PL',
      iban: '',
      email: tenant.value?.email ??'',
    },
    buyer: {
      contractorId: undefined,
      contractorType: 'company',
      name: 'DEMO BUYER',
      taxId: '',
      address: 'Random street 123',
      country: 'PL',
      iban: '',
      email: '',
    },
    body: {
      lines: [],
      vatSummary: [],
      exchange: {
        currency: 'PLN',
        exchangeRate: 1,
        date: issueDate.value,
      },
    },
    payment: {
      status: 'pending',
      dueDate: '',
      paidDate: undefined,
      paidAmount: 0,
      method: {
        name: 'bankTransfer',
        code: 'bankTransfer',
      },
      reference: '',
      terms: '',
      notes: undefined,
    },
    options: {
      language: 'en',
      template: '',
      sendEmail: false,
      emailTo: [],
    },
    issueDate: issueDate.value,
  },
})

const createLine = (): IInvoiceLine => {
  return {
    id: v4(),
    description: '',
    quantity: 0,
    unitPrice: 0,
    vatRate: {
      id: '23%',
      name: '23%',
      rate: 0.23,
      type: 'percentage',
    },
    totalNet: 0,
    totalVat: 0,
    totalGross: 0,
    productId: null,
  }
}

const addLine = () => {
  setFieldValue('body.lines', [...values.body.lines, createLine()])
}

onMounted(async () => {
  tenant.value ??= await loadTenant()
  tenantBillingAddress.value ??= await loadTenantBillingAddress()
  setFieldValue('buyer.name', tenant.value.name)
  setFieldValue('buyer.taxId', tenant.value.taxId ?? tenant.value.vatId ?? '')
  setFieldValue('buyer.address', tenantBillingAddress.value?.street ? fullAddress(tenantBillingAddress.value) : 'OUR ADDRESS')
  setFieldValue('buyer.country', tenant.value.country ?? 'PL')
  setFieldValue('buyer.email', tenant.value.email ?? '')
  addLine()
})

const onSubmit = handleSubmit(async (values) => {
  try {
    values.body.lines = values.body.lines.filter((line) => line.description)
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
</script>

<template>
  <AuthenticatedLayout>
    <div class="px-4 md:px-6 py-4 md:py-6 flex flex-col gap-y-6" data-testid="entity-details-layout">
      <div class="flex flex-row gap-4 items-center justify-between">
        <div>
          <div class="font-bold">
            {{ t('expense.add.title') }}
          </div>
          <div class="text-sm text-muted-foreground">
            <RouterLink :to="'/expenses'">
              {{ t('expense.title') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

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
              <DatePicker :model-value="values.issueDate" @update:model-value="setFieldValue('issueDate', $event)" />
            </div>

            <InvoiceInfoTable :values="values" />
          </div>

          <InvoiceSellerBox v-model:seller="seller" :values="values" @update:seller="onSellerUpdate" />

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

        <div class="mr-2 flex justify-end gap-2">
          <Button variant="outline" @click="resetForm">
            {{ t('common.cancel', 'Cancel') }}
          </Button>
          <Button type="submit" variant="primary" :disabled="isSubmitting">
            {{ t('expense.add.submit', 'Save Invoice') }}
          </Button>
        </div>
      </form>

      <AddInvoiceSidebar
        :values="values"
        :reset-form="resetForm"
        :is-submitting="isSubmitting"
        @update-currency="setFieldValue('currency', $event)"
        @update-exchange-date="setFieldValue('body.exchange.date', $event)"
      />
    </div>
  </AuthenticatedLayout>
</template>

