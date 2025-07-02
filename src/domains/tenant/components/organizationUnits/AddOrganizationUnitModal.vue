<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IOrganizationUnit, IOrganizationUnitCreate } from '../../types/organizationUnit.type'
import { tenantOrganizationUnitService } from '../../services/TenantOrganizationUnit.service'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { tenantId } = defineProps<{
  tenantId: string
}>()

const emit = defineEmits<{
  create: [IOrganizationUnitCreate]
  created: [IOrganizationUnit]
}>()

const { values, handleSubmit, resetForm, setErrors, isSubmitting } = useForm<IOrganizationUnitCreate>({
  initialValues: {
    name: '',
    code: '',
    description: '',
    isActive: true
  }
})

const onSubmit = handleSubmit(async (values: IOrganizationUnitCreate) => {
  try {
    emit('create', values)
    const organizationUnit = await tenantOrganizationUnitService.create(tenantId, values)
    emit('created', organizationUnit)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('tenant.organizationUnits.add.error'), error)
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
    :title="t('tenant.organizationUnits.add.title')"
    :description="t('tenant.organizationUnits.add.description')"
    :open="open"
    @update:open="open = $event"
  >
    <form
      class="grid grid-cols-1 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled
        v-slot="{ componentField }"
        name="name"
        :label="t('tenant.organizationUnits.fields.name')"
      >
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="code"
        :label="t('tenant.organizationUnits.fields.code')"
      >
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="description"
        :label="t('tenant.organizationUnits.fields.description')"
      >
        <Textarea v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="isActive"
        :label="t('tenant.organizationUnits.fields.isActive')"
        class="flex flex-row items-center gap-5"
      >
        <Switch v-bind="componentField" :checked="values.isActive" />
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
