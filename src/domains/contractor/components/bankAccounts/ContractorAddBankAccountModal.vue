<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { contractorBankAccountsService } from '@/domains/contractor/services/ContractorBankAccountsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractorBankAccountCreate } from '@/domains/contractor/models/contractor.model'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { contractorId } = defineProps<{
  contractorId: string
}>()

const emit = defineEmits<{
  create: [IContractorBankAccountCreate]
}>()

const { handleSubmit, setErrors, isSubmitting } = useForm<IContractorBankAccountCreate>({
  initialValues: {
    bankName: '',
    iban: '',
    currency: '',
    isDefault: false
  }
})

const onSubmit = handleSubmit(async (values: IContractorBankAccountCreate) => {
  try {
    const bankAccount = await contractorBankAccountsService.create(contractorId, values)
    emit('create', bankAccount)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('bankAccounts.add.error'), error)
  }
})
</script>

<template>
  <ModalComponent
    size="lg"
    :title="t('bankAccounts.add.title')"
    :description="t('bankAccounts.add.description')"
    :open="open"
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
