<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { contractorAddressesService } from '@/domains/contractor/services/ContractorAddressesService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IContractorAddress } from '@/domains/contractor/models/contractor.model'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { contractorId, address } = defineProps<{
  contractorId: string
  address: IContractorAddress
}>()

const emit = defineEmits<{
  update: [IContractorAddress]
}>()

const { handleSubmit, setErrors, isSubmitting } = useForm<IContractorAddress>({
  // TODO: add validation schema
  initialValues: {
    id: address.id,
    country: address.country,
    postalCode: address.postalCode,
    city: address.city,
    street: address.street,
    building: address.building,
    flat: address.flat,
    description: address.description,
    type: address.type,
    isDefault: address.isDefault
  }
})

const onSubmit = handleSubmit(async (values: IContractorAddress) => {
  try {
    const updatedAddress = await contractorAddressesService.update(contractorId, address.id, values)
    emit('update', updatedAddress)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('contractor.addresses.edit.error'), error)
  }
})
</script>

<template>
  <ModalComponent
    :title="t('contractor.addresses.edit.title')"
    :description="t('contractor.addresses.edit.description')"
    :open="open"
    size="lg"
    @update:open="open = $event"
  >
    <form
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled v-slot="{ componentField }" name="type" :label="t('address.fields.type')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="country"
        :label="t('address.fields.country')"
      >
        <Input v-bind="componentField" maxlength="2" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="city" :label="t('address.fields.city')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="street" :label="t('address.fields.street')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="building" :label="t('address.fields.building')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="flat" :label="t('address.fields.flat')">
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="description"
        class="col-span-full"
        :label="t('address.fields.description')"
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