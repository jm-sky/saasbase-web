<script setup lang="ts">
import { useFormContext } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { config } from '@/config'
import TenantBankAccountPicker from '@/domains/tenant/components/TenantBankAccountPicker.vue'
import { useTenant } from '@/domains/tenant/composables/useTenant'
import { formatIBAN, isValidIBANFormat } from '@/lib/formatIBAN'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'
import type { ITenantBankAccount } from '@/domains/tenant/types/tenant.type'

const { t } = useI18n()
const { setFieldValue } = useFormContext<IInvoiceCreate>()
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

const onBankAccountSelect = (bankAccount: ITenantBankAccount | undefined) => {
  selectedBankAccount.value = bankAccount
  if (!bankAccount) return

  setFieldValue('payment.bankAccount.iban', bankAccount.iban)
  setFieldValue('payment.bankAccount.swift', bankAccount.swift)
  setFieldValue('payment.bankAccount.bankName', bankAccount.bankName)
  setFieldValue('payment.bankAccount.country', bankAccount.country)
}

const displayIBAN = computed(() => {
  return formatIBAN(props.values.payment.bankAccount?.iban ?? '')
})

const isIBANValid = computed(() => {
  const iban = props.values.payment.bankAccount?.iban
  return !iban || isValidIBANFormat(iban, props.values.payment.bankAccount?.country ?? config.defaults.country)
})
</script>

<template>
  <div class="space-y-6">
    <div class="text-lg font-semibold">
      {{ t('financial.payment.title', 'Payment Information') }}
    </div>

    <FormFieldLabeled name="payment.notes" :label="t('financial.payment.fields.notes', 'Notes')">
      <Textarea
        :model-value="values.payment.notes"
        :placeholder="t('financial.payment.fields.notesPlaceholder', 'Additional payment notes')"
        @update:model-value="(value) => setFieldValue('payment.notes', String(value))"
      />
    </FormFieldLabeled>

    <!-- Bank Account Section -->
    <div class="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div class="font-medium">
        {{ t('financial.payment.fields.bankAccount', 'Bank Account Details') }}
      </div>

      <FormFieldLabeled name="payment.bankAccount" :label="t('financial.payment.bankAccount.select', 'Select Bank Account')">
        <TenantBankAccountPicker
          :model-value="selectedBankAccount"
          @update:model-value="onBankAccountSelect"
        />
      </FormFieldLabeled>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormFieldLabeled name="payment.bankAccount.bankName" :label="t('financial.payment.bankAccount.bankName', 'Bank Name')">
          <Input
            :model-value="values.payment.bankAccount?.bankName"
            :placeholder="t('financial.payment.bankAccount.bankNamePlaceholder', 'Account holder name')"
            @update:model-value="(value) => setFieldValue('payment.bankAccount.bankName', String(value))"
          />
        </FormFieldLabeled>

        <FormFieldLabeled name="payment.bankAccount.iban" :label="t('financial.payment.bankAccount.iban', 'IBAN')">
          <Input
            :model-value="displayIBAN"
            :placeholder="t('financial.payment.bankAccount.ibanPlaceholder', 'IBAN number')"
            :error="!isIBANValid"
            @update:model-value="(value) => setFieldValue('payment.bankAccount.iban', String(value))"
          />
          <div v-if="!isIBANValid" class="text-xs text-destructive mt-1">
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
