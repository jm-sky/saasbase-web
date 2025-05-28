<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { contractorBankAccountsService } from '@/domains/contractor/services/ContractorBankAccountsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractorBankAccount } from '@/domains/contractor/types/contractor.type'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { contractorId, bankAccount } = defineProps<{
  contractorId: string
  bankAccount: IContractorBankAccount
}>()

const emit = defineEmits<{
  update: [IContractorBankAccount]
}>()

const { handleSubmit, setErrors, setValues, isSubmitting } = useForm<IContractorBankAccount>({
  initialValues: {
    id: bankAccount.id,
    contractorId: bankAccount.contractorId,
    bankName: bankAccount.bankName,
    iban: bankAccount.iban,
    currency: bankAccount.currency,
    isDefault: bankAccount.isDefault
  }
})

const onSubmit = handleSubmit(async (values: IContractorBankAccount) => {
  try {
    const updatedBankAccount = await contractorBankAccountsService.update(contractorId, bankAccount.id, values)
    emit('update', updatedBankAccount)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('bankAccounts.edit.error'), error)
  }
})

watch(open, (value) => {
  if (value) {
    setValues(bankAccount)
  }
})
</script>

<template>
  <ModalComponent
    :title="t('bankAccounts.edit.title')"
    :description="t('bankAccounts.edit.description')"
    :open="open"
    size="lg"
    @update:open="open = $event"
  >
    <form
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled v-slot="{ componentField }" name="iban" :label="t('bankAccounts.fields.iban')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="swift" :label="t('bankAccounts.fields.swift')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="currency" :label="t('bankAccounts.fields.currency')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="bankName" :label="t('bankAccounts.fields.bankName')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="description"
        class="col-span-full"
        :label="t('bankAccounts.fields.description')"
      >
        <Textarea v-bind="componentField" />
      </FormFieldLabeled>

      <Button
        type="submit"
        class="col-span-full"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      >
        {{ t('common.save') }}
      </Button>
    </form>
  </ModalComponent>
</template>
