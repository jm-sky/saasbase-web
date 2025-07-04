<script setup lang="ts">
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import GenericSelect from '@/components/Inputs/GenericSelect.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import UserPicker from '@/domains/user/components/UserPicker.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IOrganizationUnit, IOrganizationUnitAssignUser } from '../../../types/organizationUnit.type'
import { tenantOrganizationUnitService } from '../../../services/TenantOrganizationUnit.service'
import type { IUserPreview } from '@/domains/user/types/user.type'

const { t } = useI18n()

const open = defineModel<boolean>('open', { required: true })
const selectedUser = ref<IUserPreview | undefined>()

const { unit } = defineProps<{
  unit: IOrganizationUnit
}>()

const emit = defineEmits<{
  assigned: [IOrganizationUnit]
}>()

const positionOptions = computed(() => unit.positions.map(position => ({
  value: position.id,
  label: position.name,
  data: position,
})))

const defaultPosition = computed(() => positionOptions.value.find(option => !option.data.isDirector && !option.data.isLearning))

const { handleSubmit, setFieldValue, resetForm, setErrors, isSubmitting } = useForm<IOrganizationUnitAssignUser>({
  initialValues: {
    unitId: unit.id,
    userId: selectedUser.value?.id ?? '',
    positionId: defaultPosition.value?.value ?? '',
  }
})

const onSubmit = handleSubmit(async (values: IOrganizationUnitAssignUser) => {
  try {
    const organizationUnit = await tenantOrganizationUnitService.assignUser(unit.tenantId, values)
    emit('assigned', organizationUnit)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('tenant.organizationUnits.assignUser.error'), error)
  }
})

watch(open, (isOpen) => {
  if (isOpen) {
    resetForm({
      values: {
        unitId: unit.id,
        userId: selectedUser.value?.id ?? '',
        positionId: defaultPosition.value?.value ?? '',
      }
    })
  }
})
</script>

<template>
  <ModalComponent
    v-model:open="open"
    size="md"
    :title="t('tenant.organizationUnits.assignUser.title')"
    :description="t('tenant.organizationUnits.assignUser.description')"
  >
    <form
      class="grid grid-cols-1 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <div class="flex flex-col gap-2 border rounded-md px-3 py-2 bg-muted">
        <div class="text-xs text-muted-foreground">
          {{ unit.parent?.name }}
        </div>
        <div class="font-medium">
          {{ unit.name }}
        </div>
      </div>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="userId"
        :label="t('tenant.organizationUnits.fields.user')"
      >
        <UserPicker
          v-bind="componentField"
          v-model="selectedUser"
          @update:model-value="setFieldValue('userId', $event?.id ?? '')"
        />
      </FormFieldLabeled>

      <FormFieldLabeled
        v-slot="{ componentField }"
        name="positionId"
        :label="t('tenant.organizationUnits.fields.position')"
      >
        <GenericSelect
          v-bind="componentField"
          :model-value="defaultPosition"
          :options="positionOptions"
          @update:model-value="setFieldValue('positionId', $event?.value ?? '')"
        />
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
