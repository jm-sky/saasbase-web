<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { contractorBankAccountsService } from '@/domains/contractor/services/ContractorBankAccountsService'
import IbanLookupButton from '@/domains/utils/components/IbanLookupButton.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractorBankAccountCreate } from '@/domains/contractor/types/contractor.type'
import type { IIbanInfo } from '@/domains/utils/services/IbanInfoService'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { country, contractorId } = defineProps<{
  contractorId: string
  country?: string
}>()

const emit = defineEmits<{
  create: [IContractorBankAccountCreate]
}>()

const { handleSubmit, setValues, setErrors, isSubmitting } = useForm<IContractorBankAccountCreate>({
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
    <form
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled
        v-slot="{ componentField }"
        name="iban"
        class="col-span-full"
        :label="t('bankAccounts.fields.iban')"
      >
        <div class="flex flex-row gap-2 items-center grow">
          <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
          <IbanLookupButton
            :iban="componentField.modelValue"
            :country
            class="h-9"
            @lookup="onBankAccountLookup"
          />
        </div>
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="swift" :label="t('bankAccounts.fields.swift')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="currency" :label="t('bankAccounts.fields.currency')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="bankName"
        class="col-span-full"
        :label="t('bankAccounts.fields.bankName')"
      >
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
