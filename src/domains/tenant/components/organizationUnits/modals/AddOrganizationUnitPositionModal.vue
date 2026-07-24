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
import PositionCategoryPicker from '@/domains/rights/components/PositionCategoryPicker.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import { tenantOrganizationUnitService } from '../../../services/TenantOrganizationUnit.service'
import type { IOrganizationUnit, IOrganizationUnitPositionCreate } from '../../../types/organizationUnit.type'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })

const { unit } = defineProps<{
  unit: IOrganizationUnit
}>()

const emit = defineEmits<{
  added: [IOrganizationUnit]
}>()

const { values, handleSubmit, setFieldValue, resetForm, setErrors, isSubmitting } = useForm<IOrganizationUnitPositionCreate>({
  initialValues: {
    unitId: unit.id,
    name: '',
    description: '',
    category: '',
    isDirector: false,
    isLearning: false,
    isActive: true,
  }
})

const onSubmit = handleSubmit(async (values: IOrganizationUnitPositionCreate) => {
  try {
    const organizationUnit = await tenantOrganizationUnitService.addPosition(unit.tenantId, values)
    emit('added', organizationUnit)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('tenant.organizationUnits.addPosition.error'), error)
  }
})

watch(open, (isOpen) => {
  if (isOpen) {
    resetForm({
      values: {
        unitId: unit.id,
        name: '',
        description: '',
        category: '',
        isDirector: false,
        isLearning: false,
        isActive: true,
      }
    })
  }
})
</script>

<template>
  <ModalComponent
    v-model:open="open"
    size="md"
    :title="t('tenant.organizationUnits.addPosition.title')"
    :description="t('tenant.organizationUnits.addPosition.description')"
  >
    <form
      class="grid grid-cols-1 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <div class="flex flex-col gap-2 border rounded-md px-3 py-2 bg-muted">
        <div v-if="unit.parent" class="text-xs text-muted-foreground">
          {{ unit.parent?.name }}
        </div>
        <div class="font-medium">
          {{ unit.name }}
        </div>
      </div>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="name"
        :label="t('tenant.organizationUnits.addPosition.fields.name')"
      >
        <Input v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="description"
        :label="t('tenant.organizationUnits.addPosition.fields.description')"
      >
        <Textarea v-bind="componentField" />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="category"
        :label="t('tenant.organizationUnits.addPosition.fields.category')"
      >
        <PositionCategoryPicker
          v-bind="componentField"
          :model-value="values.category"
          @update:model-value="setFieldValue('category', $event ?? '')"
        />
      </FormFieldLabeled>

      <div class="grid grid-cols-2 gap-4">
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="isDirector"
          :label="t('tenant.organizationUnits.addPosition.fields.isDirector')"
          class="flex flex-col items-center gap-1"
        >
          <Switch v-bind="componentField" />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="isLearning"
          :label="t('tenant.organizationUnits.addPosition.fields.isLearning')"
          class="flex flex-col items-center gap-1"
        >
          <Switch v-bind="componentField" />
        </FormFieldLabeled>
      </div>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="isActive"
        :label="t('tenant.organizationUnits.addPosition.fields.isActive')"
        class="flex flex-col items-center gap-1"
      >
        <Switch v-bind="componentField" />
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
