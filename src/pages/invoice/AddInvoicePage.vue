<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import PartySideForContractorCard from '@/domains/financial/components/PartySideForContractorCard.vue'
import PartySideForTenantCard from '@/domains/financial/components/PartySideForTenantCard.vue'
import NumberingTemplatePicker from '@/domains/invoice/components/NumberingTemplatePicker.vue'
import { invoiceService } from '@/domains/invoice/services/invoiceService'
import ExchangeRatePicker from '@/domains/shared/components/ExchangeRatePicker.vue'
import { tenantService } from '@/domains/tenant/services/TenantService'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractor } from '@/domains/contractor/types/contractor.type'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'
import type { TDate } from '@/domains/shared/types/common'

const { t } = useI18n()
const { toast } = useToast()
const router = useRouter()
const tenantStore = useTenantStore()
const { tenant, tenantBillingAddress } = storeToRefs(tenantStore)

const issueDate = ref<TDate | undefined>(new Date().toISOString().split('T')[0])

const { isSubmitting, handleSubmit, values, setErrors, setFieldValue, resetForm } = useForm<IInvoiceCreate>({
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
    issueDate: issueDate.value,
    numberingTemplate: undefined,
  },
})

onMounted(async () => {
  tenant.value ??= await tenantService.get(tenantStore.tenantId ?? '')
  setFieldValue('seller.name', tenant.value.name)
  setFieldValue('seller.taxId', tenant.value.taxId ?? '')
  setFieldValue('seller.address', tenantBillingAddress.value?.street ?? 'OUR ADDRESS')
  setFieldValue('seller.country', tenant.value.country ?? 'PL')
  setFieldValue('seller.email', tenant.value.email ?? '')
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

const updateBuyer = (contractor: IContractor | undefined) => {
  if (!contractor) return
  setFieldValue('buyer.contractorId', contractor.id)
  setFieldValue('buyer.contractorType', 'contractor')
  setFieldValue('buyer.name', contractor.name)
  setFieldValue('buyer.taxId', contractor.vatId)
}
</script>

<template>
  <AuthenticatedLayout>
    <div class="m-6 p-6 md:p-8 border rounded-md shadow-lg">
      <div class="font-bold text-2xl mb-4 text-center">
        {{ t('invoice.add.title', 'Add Invoice') }}
      </div>

      <form class="flex flex-col gap-y-2 gap-x-8" @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
          <PartySideForTenantCard :title="t('financial.fields.seller', 'Seller')" :values="values.seller" />
          <PartySideForContractorCard :title="t('financial.fields.buyer', 'Buyer')" :values="values.buyer" @contractor-selected="updateBuyer" />
        </div>

        <div class="flex flex-col gap-y-2 items-center justify-center mt-2 mb-6">
          <div class="font-bold text-lg">
            {{ t(`financial.invoiceType.${values.type}`, 'Type') }}
          </div>
          <div class="font-bold text-xl">
            <FormFieldLabeled name="numberingTemplateId" :disabled="isSubmitting">
              <NumberingTemplatePicker
                :id="values.numberingTemplateId"
                :model-value="values.numberingTemplate"
                :invoice-type="values.type"
                @update:model-value="setFieldValue('numberingTemplate', $event)"
                @update:id="setFieldValue('numberingTemplateId', $event)"
              />
            </FormFieldLabeled>
            <FormFieldLabeled
              v-slot="{ componentField }"
              name="number"
              :disabled="isSubmitting"
            >
              <Input v-bind="componentField" filled />
            </FormFieldLabeled>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
          <div class="grid grid-cols-3 gap-x-8 gap-y-2 border rounded-md p-4 shadow-md">
            <FormFieldLabeled
              v-slot="{ componentField }"
              name="issueDate"
              :label="t('financial.fields.issueDate', 'issueDate')"
              :disabled="isSubmitting"
            >
              <Input type="date" v-bind="componentField" filled />
            </FormFieldLabeled>
            <FormFieldLabeled
              v-slot="{ componentField }"
              name="status"
              :label="t('financial.fields.status', 'Status')"
              :disabled="isSubmitting"
              readonly
            >
              <Input v-bind="componentField" filled />
            </FormFieldLabeled>
          </div>
          <div class="grid grid-cols-3 gap-x-8 gap-y-2 border rounded-md p-4 shadow-md">
            <FormFieldLabeled
              v-slot="{ componentField }"
              name="currency"
              :label="t('financial.fields.currency', 'Currency')"
              :disabled="isSubmitting"
            >
              <Input v-bind="componentField" filled />
            </FormFieldLabeled>

            <FormFieldLabeled
              v-slot="{ componentField }"
              name="body.exchange.date"
              :label="t('financial.fields.exchange.date', 'Exchange Rate Date')"
              :disabled="isSubmitting"
            >
              <Input type="date" v-bind="componentField" filled />
            </FormFieldLabeled>

            <FormFieldLabeled
              name="body.exchange.exchangeRate"
              :label="t('financial.fields.exchangeRate', 'Exchange Rate')"
              :disabled="isSubmitting"
            >
              <ExchangeRatePicker
                :date="values.body.exchange.date"
                :rate="values.body.exchange.exchangeRate"
              />
            </FormFieldLabeled>
          </div>
        </div>

        <Separator class="my-4" />

        <div class="col-span-2">
          <Button type="submit" :disabled="isSubmitting" class="w-full">
            {{ t('common.add') }}
          </Button>
        </div>
      </form>
    </div>
  </AuthenticatedLayout>
</template>

