<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { contractorContactsService } from '@/domains/contractor/services/ContractorContactsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractorContact } from '@/domains/contractor/types/contractor.type'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { contractorId, contact } = defineProps<{
  contractorId: string
  contact: IContractorContact
}>()

const emit = defineEmits<{
  update: [IContractorContact]
}>()

const { handleSubmit, setErrors, setValues, isSubmitting } = useForm<IContractorContact>({
  initialValues: {
    id: contact.id,
    contractorId: contact.contractorId,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    position: contact.position,
    description: contact.description,
  }
})

const onSubmit = handleSubmit(async (values: IContractorContact) => {
  try {
    const updatedContact = await contractorContactsService.update(contractorId, contact.id, values)
    emit('update', updatedContact)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('contacts.edit.error'), error)
  }
})

watch(open, (value) => {
  if (value) {
    setValues(contact)
  }
})
</script>

<template>
  <ModalComponent
    :title="t('contacts.edit.title')"
    :description="t('contacts.edit.description')"
    :open="open"
    size="lg"
    @update:open="open = $event"
  >
    <form
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled v-slot="{ componentField }" name="name" :label="t('contacts.fields.name')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="position" :label="t('contacts.fields.position')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="email" :label="t('contacts.fields.email')">
        <Input v-bind="componentField" type="email" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="phone" :label="t('contacts.fields.phone')">
        <Input v-bind="componentField" type="tel" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="description" :label="t('contacts.fields.description')">
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
