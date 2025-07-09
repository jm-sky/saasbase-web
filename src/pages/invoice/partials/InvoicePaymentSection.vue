<script setup lang="ts">
import { useFormContext } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldError from '@/components/Form/FormFieldError.vue'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import DatePicker from '@/components/Inputs/DatePicker.vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import TenantBankAccountPicker from '@/domains/tenant/components/TenantBankAccountPicker.vue'
import { useTenant } from '@/domains/tenant/composables/useTenant'
import { formatIBAN, isValidIBANFormat } from '@/lib/formatIBAN'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'
import type { ITenantBankAccount } from '@/domains/tenant/types/tenant.type'

const { t } = useI18n()
const { setFieldValue, values } = useFormContext<IInvoiceCreate>()
const { loadTenantBankAccounts } = useTenant()

const props = defineProps<{
  values: IInvoiceCreate
}>()

const tenantBankAccounts = ref<ITenantBankAccount[]>([])
const selectedBankAccount = ref<ITenantBankAccount | undefined>()

// Load tenant bank accounts and find current selection
onMounted(async () => {
  tenantBankAccounts.value = await loadTenantBankAccounts()
  
  // Find the matching bank account based on IBAN
  if (props.values.payment.bankAccount?.iban) {
    selectedBankAccount.value = tenantBankAccounts.value.find(
      account => account.iban === props.values.payment.bankAccount?.iban
    )
  }
})

const paymentMethods = [
  { value: 'BANK_TRANSFER', label: t('financial.paymentMethod.bankTransfer', 'Bank Transfer') },
  { value: 'CASH', label: t('financial.paymentMethod.cash', 'Cash') },
  { value: 'CREDIT_CARD', label: t('financial.paymentMethod.creditCard', 'Credit Card') },
  { value: 'CHEQUE', label: t('financial.paymentMethod.cheque', 'Cheque') },
  { value: 'OTHER', label: t('financial.paymentMethod.other', 'Other') },
]

const paymentStatuses = [
  { value: 'PENDING', label: t('financial.paymentStatus.pending', 'Pending') },
  { value: 'PAID', label: t('financial.paymentStatus.paid', 'Paid') },
  { value: 'OVERDUE', label: t('financial.paymentStatus.overdue', 'Overdue') },
  { value: 'CANCELLED', label: t('financial.paymentStatus.cancelled', 'Cancelled') },
]

const showBankAccount = computed(() => props.values.payment.method === 'BANK_TRANSFER')

const onBankAccountSelect = (bankAccount: ITenantBankAccount | undefined) => {
  selectedBankAccount.value = bankAccount
  if (!bankAccount) return
  
  setFieldValue('payment.bankAccount.name', bankAccount.name ?? bankAccount.bankName)
  setFieldValue('payment.bankAccount.iban', bankAccount.iban)
  setFieldValue('payment.bankAccount.swift', bankAccount.swift)
  setFieldValue('payment.bankAccount.address', bankAccount.address)
}

const onIBANChange = (value: string) => {
  // Store the raw value (without formatting) for the payload
  const rawIBAN = value.replace(/\s/g, '').toUpperCase()
  setFieldValue('payment.bankAccount.iban', rawIBAN)
}

const displayIBAN = computed(() => {
  return formatIBAN(props.values.payment.bankAccount?.iban || '')
})

const isIBANValid = computed(() => {
  const iban = props.values.payment.bankAccount?.iban
  return !iban || isValidIBANFormat(iban)
})
</script>

<template>
  <div class="space-y-6">
    <div class="text-lg font-semibold">
      {{ t('financial.payment.title', 'Payment Information') }}
    </div>

    <FormFieldLabeled name="payment.notes" :label="t('financial.payment.notes', 'Notes')">
      <Textarea
        :model-value="values.payment.notes"
        :placeholder="t('financial.payment.notesPlaceholder', 'Additional payment notes')"
        @update:model-value="(value) => setFieldValue('payment.notes', String(value))"
      />
    </FormFieldLabeled>

    <!-- Bank Account Section -->
    <div v-if="showBankAccount" class="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div class="font-medium">
        {{ t('financial.payment.bankAccount', 'Bank Account Details') }}
      </div>

      <FormFieldLabeled name="payment.bankAccount" :label="t('financial.payment.bankAccount.select', 'Select Bank Account')">
        <TenantBankAccountPicker
          :model-value="selectedBankAccount"
          @update:model-value="onBankAccountSelect"
        />
      </FormFieldLabeled>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormFieldLabeled name="payment.bankAccount.name" :label="t('financial.payment.bankAccount.name', 'Account Name')">
          <Input
            :model-value="values.payment.bankAccount?.name"
            :placeholder="t('financial.payment.bankAccount.namePlaceholder', 'Account holder name')"
            @update:model-value="(value) => setFieldValue('payment.bankAccount.name', String(value))"
          />
        </FormFieldLabeled>

        <FormFieldLabeled name="payment.bankAccount.iban" :label="t('financial.payment.bankAccount.iban', 'IBAN')">
          <Input
            :model-value="displayIBAN"
            :placeholder="t('financial.payment.bankAccount.ibanPlaceholder', 'IBAN number')"
            :class="{ 'border-red-500': !isIBANValid }"
            @update:model-value="onIBANChange"
          />
          <div v-if="!isIBANValid" class="text-xs text-red-600 mt-1">
            {{ t('financial.payment.bankAccount.ibanInvalid', 'Invalid IBAN format') }}
          </div>
        </FormFieldLabeled>

        <FormFieldLabeled name="payment.bankAccount.swift" :label="t('financial.payment.bankAccount.swift', 'SWIFT Code')">
          <Input
            :model-value="values.payment.bankAccount?.swift"
            :placeholder="t('financial.payment.bankAccount.swiftPlaceholder', 'SWIFT/BIC code')"
            @update:model-value="(value) => setFieldValue('payment.bankAccount.swift', String(value))"
          />
        </FormFieldLabeled>
      </div>
    </div>
  </div>
</template>