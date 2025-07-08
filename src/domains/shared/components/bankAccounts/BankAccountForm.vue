<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import IbanLookupButton from '@/domains/utils/components/IbanLookupButton.vue'
import type { IIbanInfo } from '@/domains/utils/services/IbanInfoService'

const { t } = useI18n()

defineProps<{
  isSubmitting: boolean
  country?: string
}>()

const emit = defineEmits<{
  ibanLookup: [IIbanInfo]
}>()

const onBankAccountLookup = (ibanInfo: IIbanInfo) => {
  emit('ibanLookup', ibanInfo)
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          :country="country"
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
</template>
