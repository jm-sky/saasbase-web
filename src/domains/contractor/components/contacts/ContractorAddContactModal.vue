<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { contractorContactsService } from '@/domains/contractor/services/ContractorContactsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractorContactCreate } from '@/domains/contractor/types/contractor.type'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { contractorId } = defineProps<{
  contractorId: string
}>()

const emit = defineEmits<{
  create: [IContractorContactCreate]
}>()

const { handleSubmit, setErrors, isSubmitting } = useForm<IContractorContactCreate>({
  initialValues: {
    name: '',
    email: '',
    phone: '',
    position: '',
    description: '',
  }
})

const onSubmit = handleSubmit(async (values: IContractorContactCreate) => {
  try {
    const contact = await contractorContactsService.create(contractorId, values)
    emit('create', contact)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('contacts.add.error'), error)
  }
})
</script>

<template>
  <ModalComponent
    size="lg"
    :title="t('contacts.add.title')"
    :description="t('contacts.add.description')"
    :open="open"
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

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="description"
        class="col-span-full"
        :label="t('contacts.fields.description')"
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
