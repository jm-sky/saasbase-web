<script setup lang="ts">
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { expenseService } from '@/domains/expense/services/expenseService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IExpense } from '@/domains/expense/types/expense.type'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const expenseId = route.params.id as string
const loading = ref(false)
const error = ref<string | null>(null)

const { isSubmitting, handleSubmit, setValues, setErrors, resetForm } = useForm<Omit<IExpense, 'id' | 'createdAt' | 'updatedAt'>>({
  initialValues: {
    number: '',
    type: 'basic',
    status: 'draft',
    numberingTemplateId: '',
    totalNet: 0,
    totalTax: 0,
    totalGross: 0,
    currency: 'PLN',
    exchangeRate: 1,
    seller: {
      contractorId: '',
      contractorType: '',
      name: '',
      taxId: '',
      address: '',
      country: '',
      iban: '',
      email: '',
    },
    buyer: {
      contractorId: '',
      contractorType: '',
      name: '',
      taxId: '',
      address: '',
      country: '',
      iban: '',
      email: '',
    },
    body: {
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
    issueDate: '',
  },
})

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await expenseService.get(expenseId)
    setValues(response)
  } catch (err) {
    handleErrorWithToast(t('expense.show.error', 'Error'), err)
    error.value = t('expense.show.error', 'Failed to load expense')
  } finally {
    loading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await expenseService.update(expenseId, values)
    toast.success(t('expense.edit.success', 'Expense updated successfully'))
    resetForm()
    await router.push(`/expenses/${expenseId}/show/overview`)
  } catch (error: unknown) {
    console.error('[EditExpensePage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('expense.edit.error', 'Could not edit expense'), error)
  }
})

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="m-6 p-6 md:p-8 border rounded-md shadow-lg">
      <form class="flex flex-col gap-y-2 gap-x-8" @submit.prevent="onSubmit">
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="number"
          :label="t('expense.fields.number', 'Number')"
          :disabled="isSubmitting"
        >
          <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
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
        <div class="col-span-2">
          <Button type="submit" :disabled="isSubmitting" class="w-full">
            {{ t('expense.edit.title', 'Edit Expense') }}
          </Button>
        </div>
      </form>
    </div>
  </AuthenticatedLayout>
</template>

