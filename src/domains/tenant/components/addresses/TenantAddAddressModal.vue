<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { tenantAddressesService } from '@/domains/tenant/services/TenantAddressesService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import TenantAddressTypeLookup from './TenantAddressTypeLookup.vue'
import type { ITenantAddressCreate } from '@/domains/tenant/types/tenant.type'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { tenantId } = defineProps<{
  tenantId: string
}>()

const emit = defineEmits<{
  create: [ITenantAddressCreate]
}>()

const { handleSubmit, values, setErrors, setFieldValue, resetForm, isSubmitting } = useForm<ITenantAddressCreate>({
  initialValues: {
    country: '',
    postalCode: '',
    city: '',
    street: '',
    building: '',
    flat: '',
    description: '',
    type: 'contact',
    isDefault: false
  }
})

const onSubmit = handleSubmit(async (values: ITenantAddressCreate) => {
  try {
    const address = await tenantAddressesService.create(tenantId, values)
    emit('create', address)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('address.add.error'), error)
  }
})

watch(open, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>

<template>
  <ModalComponent
    size="lg"
    :title="t('tenant.addresses.add.title')"
    :description="t('tenant.addresses.add.description')"
    :open="open"
    @update:open="open = $event"
  >
    <form
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled name="type" :label="t('address.fields.type')">
        <TenantAddressTypeLookup
          :model-value="values.type"
          @update:model-value="setFieldValue('type', $event)"
        />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="country" :label="t('address.fields.country')">
        <Input maxlength="2" v-bind="componentField" />
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
