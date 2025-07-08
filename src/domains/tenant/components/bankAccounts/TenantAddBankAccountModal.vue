<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import ModalComponent from '@/components/ModalComponent.vue'
import { config } from '@/config'
import BankAccountForm from '@/domains/shared/components/bankAccounts/BankAccountForm.vue'
import { tenantBankAccountsService } from '@/domains/tenant/services/TenantBankAccountsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import { useTenant } from '../../composables/useTenant'
import type { ITenantBankAccountCreate } from '@/domains/tenant/types/tenant.type'
import type { IIbanInfo } from '@/domains/utils/services/IbanInfoService'

const { t } = useI18n()
const { tenant } = useTenant()

const open = defineModel<boolean>('open', { required: true })

const { tenantId } = defineProps<{
  tenantId: string
}>()

const emit = defineEmits<{
  create: [ITenantBankAccountCreate]
}>()

const { handleSubmit, setValues, setErrors, isSubmitting } = useForm<ITenantBankAccountCreate>({
  initialValues: {
    bankName: '',
    iban: '',
    currency: '',
    isDefault: false
  }
})

const onSubmit = handleSubmit(async (values: ITenantBankAccountCreate) => {
  try {
    const bankAccount = await tenantBankAccountsService.create(tenantId, values)
    emit('create', bankAccount)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('bankAccounts.add.error'), error)
  }
})

const onBankAccountLookup = (ibanInfo: IIbanInfo) => {
  setValues({
    iban: ibanInfo.iban,
    swift: ibanInfo.swift ?? '',
    bankName: ibanInfo.bankName,
  })
}
</script>

<template>
  <ModalComponent
    size="lg"
    :title="t('bankAccounts.add.title')"
    :description="t('bankAccounts.add.description')"
    :open="open"
    @update:open="open = $event"
  >
    <BankAccountForm
      :country="tenant?.country ?? config.defaults.country"
      :is-submitting="isSubmitting"
      @submit.prevent="onSubmit"
      @iban-lookup="onBankAccountLookup"
    />
  </ModalComponent>
</template>
