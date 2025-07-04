<script setup lang="ts">
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IOrganizationUnit } from '../../../types/organizationUnit.type'
import { tenantOrganizationUnitService } from '../../../services/TenantOrganizationUnit.service'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { tenantId, unit } = defineProps<{
  tenantId: string
  unit: IOrganizationUnit
}>()

const emit = defineEmits<{
  update: [IOrganizationUnit]
  updated: [IOrganizationUnit]
}>()

const isRoot = computed<boolean>(() => !unit.parentId)

const { values, handleSubmit, resetForm, setFieldValue, setErrors, isSubmitting } = useForm<IOrganizationUnit>({
  initialValues: {
    name: unit.name,
    code: unit.code,
    description: unit.description,
    isActive: unit.isActive,
    parentId: unit.parentId,
  }
})

const onSubmit = handleSubmit(async (values: IOrganizationUnit) => {
  try {
    emit('update', values)
    const organizationUnit = await tenantOrganizationUnitService.update(tenantId, unit.id, values)
    emit('updated', organizationUnit)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('tenant.organizationUnits.edit.error'), error)
  }
})

watch(open, (isOpen) => {
  if (isOpen) {
    resetForm({
      values: {
        name: unit.name,
        code: unit.code,
        description: unit.description,
        isActive: unit.isActive,
        parentId: unit.parentId,
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
    :title="t('tenant.organizationUnits.edit.title')"
    :description="t('tenant.organizationUnits.edit.description')"
  >
    <form
      class="grid grid-cols-1 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled
        v-if="!isRoot"
        name="parentId"
        :label="t('tenant.organizationUnits.fields.parent')"
      >
        <Input :model-value="unit.parent?.name" :disabled="true" />
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
          :disabled="isRoot"
        >
          <Switch v-bind="componentField" :checked="values.isActive" />
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
