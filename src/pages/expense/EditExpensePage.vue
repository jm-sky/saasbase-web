<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { expenseService } from '@/domains/expense/services/expenseService'
import { useExpenseStore } from '@/domains/expense/stores/expense.store'
import PartySideForContractorCard from '@/domains/financial/components/PartySideForContractorCard.vue'
import PartySideForTenantCard from '@/domains/financial/components/PartySideForTenantCard.vue'
import { tenantService } from '@/domains/tenant/services/TenantService'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractor } from '@/domains/contractor/types/contractor.type'
import type { IExpenseCreate } from '@/domains/expense/types/expense.type'

const { t } = useI18n()
const { toast } = useToast()
const route = useRoute()
const router = useRouter()
const tenantStore = useTenantStore()
const { tenant } = storeToRefs(tenantStore)
const expenseStore = useExpenseStore()
const { expense } = storeToRefs(expenseStore)

const expenseId = route.params.id as string
const loading = ref(false)

const { isSubmitting, handleSubmit, values, setErrors, setValues, setFieldValue, resetForm } = useForm<IExpenseCreate>({
  initialValues: {
    number: expense.value?.number ?? '',
    type: expense.value?.type ?? 'basic',
    status: expense.value?.status ?? 'draft',
    numberingTemplateId: expense.value?.numberingTemplateId ?? '',
    totalNet: expense.value?.totalNet ?? 0,
    totalTax: expense.value?.totalTax ?? 0,
    totalGross: expense.value?.totalGross ?? 0,
    currency: expense.value?.currency ?? 'PLN',
    exchangeRate: expense.value?.exchangeRate ?? 1,
    seller: {
      contractorId: expense.value?.seller.contractorId ?? undefined,
      contractorType: expense.value?.seller.contractorType ?? 'company',
      name: expense.value?.seller.name ?? 'DEMO BUYER',
      taxId: expense.value?.seller.taxId ?? '',
      address: expense.value?.seller.address ?? 'Random street 123',
      country: expense.value?.seller.country ?? 'PL',
      iban: expense.value?.seller.iban ?? '',
      email: expense.value?.seller.email ?? '',
    },
    buyer: {
      contractorId: expense.value?.buyer.contractorId ?? undefined,
      contractorType: expense.value?.buyer.contractorType ?? 'company',
      name: expense.value?.buyer.name ?? 'DEMO COMPANY',
      taxId: expense.value?.buyer.taxId ?? '',
      address: expense.value?.buyer.address ?? 'OUR ADDRESS',
      country: expense.value?.buyer.country ?? 'PL',
      iban: expense.value?.buyer.iban ?? '',
      email: expense.value?.buyer.email ?? '',
    },
    body: {
      lines: expense.value?.body.lines ?? [],
      vatSummary: expense.value?.body.vatSummary ?? [],
      exchange: {
        currency: expense.value?.body.exchange.currency ?? 'PLN',
        exchangeRate: expense.value?.body.exchange.exchangeRate ?? 1,
        date: expense.value?.body.exchange.date ?? '',
      },
    },
    payment: {
      status: expense.value?.payment.status ?? 'pending',
      dueDate: expense.value?.payment.dueDate ?? '',
      paidDate: expense.value?.payment.paidDate ?? null,
      paidAmount: expense.value?.payment.paidAmount ?? 0,
      method: expense.value?.payment.method ?? 'bankTransfer',
      reference: expense.value?.payment.reference ?? '',
      terms: expense.value?.payment.terms ?? '',
      notes: expense.value?.payment.notes ?? null,
    },
    options: {
      language: expense.value?.options.language ?? 'en',
      template: expense.value?.options.template ?? '',
      sendEmail: expense.value?.options.sendEmail ?? false,
      emailTo: expense.value?.options.emailTo ?? [],
    },
    issueDate: expense.value?.issueDate ?? '2025-01-01',
  },
})

const refresh = async () => {
  try {
    loading.value = true
    const response = await expenseService.get(expenseId)
    setValues(response)
  } catch (err) {
    handleErrorWithToast(t('expense.show.error', 'Error'), err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  tenant.value ??= await tenantService.get(tenantStore.tenantId ?? '')
  await refresh()
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const expense = await expenseService.update(expenseId, values)
    toast.success(t('expense.edit.success', 'Expense updated successfully'))
    resetForm()
    await router.push(`/expenses/${expense.id}/show`)
  } catch (error: unknown) {
    console.error('[EditExpensePage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('expense.edit.error', 'Could not update expense'), error)
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
        {{ t('expense.edit.title', 'Edit Expense') }}
      </div>

      <form class="flex flex-col gap-y-2 gap-x-8" @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
          <PartySideForTenantCard title="Seller" :values="values.seller" />
          <PartySideForContractorCard title="Buyer" :values="values.buyer" @contractor-selected="updateBuyer" />
        </div>

        <div class="flex flex-col gap-y-2 items-center justify-center mt-2 mb-6">
          <div class="font-bold text-lg">
            {{ t(`expense.type.${values.type}`, 'Type') }}
          </div>
          <div class="font-bold text-xl">
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
            :label="t('expense.fields.issueDate', 'issueDate')"
            :disabled="isSubmitting"
          >
            <Input type="date" v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
          </FormFieldLabeled>
          <FormFieldLabeled
            v-slot="{ componentField }"
            name="type"
            :label="t('expense.fields.type', 'Type')"
            :disabled="isSubmitting"
          >
            <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
          </FormFieldLabeled>
          <FormFieldLabeled
            v-slot="{ componentField }"
            name="status"
            :label="t('expense.fields.status', 'Status')"
            :disabled="isSubmitting"
          >
            <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
          </FormFieldLabeled>
          <FormFieldLabeled
            v-slot="{ componentField }"
            name="currency"
            :label="t('expense.fields.currency', 'Currency')"
            :disabled="isSubmitting"
          >
            <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
          </FormFieldLabeled>
        </div>

        <Separator class="my-4" />

        <div class="col-span-2">
          <Button type="submit" :disabled="isSubmitting" class="w-full">
            {{ t('common.save') }}
          </Button>
        </div>
      </form>
    </div>
  </AuthenticatedLayout>
</template>

