<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import NumberingTemplatePicker from '@/domains/invoice/components/NumberingTemplatePicker.vue'
import { invoiceService } from '@/domains/invoice/services/invoiceService'
import { tenantService } from '@/domains/tenant/services/TenantService'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import PartySideForContractorCard from './partials/PartySideForContractorCard.vue'
import PartySideForTenantCard from './partials/PartySideForTenantCard.vue'
import type { IContractor } from '@/domains/contractor/types/contractor.type'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'

const { t } = useI18n()
const { toast } = useToast()
const router = useRouter()
const tenantStore = useTenantStore()
const { tenant, tenantBillingAddress } = storeToRefs(tenantStore)

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
          <PartySideForTenantCard title="Seller" :values="values.seller" />
          <PartySideForContractorCard title="Buyer" :values="values.buyer" @contractor-selected="updateBuyer" />
        </div>

        <div class="flex flex-col gap-y-2 items-center justify-center mt-2 mb-6">
          <div class="font-bold text-lg">
            {{ t(`invoice.type.${values.type}`, 'Type') }}
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
              <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
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

