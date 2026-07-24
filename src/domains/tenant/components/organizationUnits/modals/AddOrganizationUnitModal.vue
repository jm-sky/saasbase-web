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
import { tenantOrganizationUnitService } from '../../../services/TenantOrganizationUnit.service'
import type { IOrganizationUnit, IOrganizationUnitCreate } from '../../../types/organizationUnit.type'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { tenantId, parentUnit } = defineProps<{
  tenantId: string
  parentUnit: IOrganizationUnit | null
}>()

const emit = defineEmits<{
  create: [IOrganizationUnitCreate]
  created: [IOrganizationUnit]
}>()

const { values, handleSubmit, resetForm, setFieldValue, setErrors, isSubmitting } = useForm<IOrganizationUnitCreate>({
  initialValues: {
    name: '',
    code: '',
    description: '',
    isActive: true,
    parentId: parentUnit?.id ?? null,
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
    resetForm({
      values: {
        name: '',
        code: '',
        description: '',
        isActive: true,
        parentId: parentUnit?.id ?? null,
      }
    })
  }
})

const generateCode = () => {
  const slug = values.name.toLowerCase().replace(/ /g, '-')
  setFieldValue('code', slug)
}
</script>

<template>
  <ModalComponent
    v-model:open="open"
    size="lg"
    :title="t('tenant.organizationUnits.add.title')"
    :description="t('tenant.organizationUnits.add.description')"
  >
    <form
      class="grid grid-cols-1 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled
        name="parentId"
        :label="t('tenant.organizationUnits.fields.parent')"
      >
        <Input :model-value="parentUnit?.name" :disabled="true" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="name"
        :label="t('tenant.organizationUnits.fields.name')"
      >
        <Input v-bind="componentField" @change="generateCode" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="description"
        :label="t('tenant.organizationUnits.fields.description')"
      >
        <Textarea v-bind="componentField" />
      </FormFieldLabeled>


      <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="code"
          :label="t('tenant.organizationUnits.fields.code')"
        >
          <Input v-bind="componentField" />
        </FormFieldLabeled>
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="isActive"
          :label="t('tenant.organizationUnits.fields.isActive')"
          class="flex flex-col items-center gap-1"
        >
          <Switch v-bind="componentField" :model-value="values.isActive" />
        </FormFieldLabeled>
      </div>

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
