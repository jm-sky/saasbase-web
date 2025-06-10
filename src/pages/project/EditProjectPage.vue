<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import ProjectSidebar from '@/domains/project/components/ProjectSidebar.vue'
import ProjectTypePicker from '@/domains/project/components/ProjectTypePicker.vue'
import { projectService } from '@/domains/project/services/ProjectService'
import { useProjectStore } from '@/domains/project/stores/project.store'
import MeasurementUnitPicker from '@/domains/shared/components/MeasurementUnitPicker.vue'
import VatRatePicker from '@/domains/shared/components/VatRatePicker.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IProjectCreate } from '@/domains/project/types/project.type'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const projectId = route.params.id as string
const { project } = storeToRefs(useProjectStore())

const loading = ref(false)
const error = ref<string | null>(null)


const { isSubmitting, handleSubmit, values, setValues, setFieldValue, setErrors, resetForm } = useForm<IProjectCreate>({
  initialValues: {
    name: project.value?.name ?? '',
    type: project.value?.type ?? 'project',
    description: project.value?.description ?? '',
    priceNet: project.value?.priceNet ?? undefined,
    unitId: project.value?.unitId ?? undefined,
    vatRateId: project.value?.vatRateId ?? undefined,
    logo: project.value?.logo ?? undefined,
    unit: project.value?.unit ?? undefined,
    vatRate: project.value?.vatRate ?? undefined,
  },
})

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await projectService.get(projectId)
    project.value = response
    setValues(response)
  } catch (err) {
    handleErrorWithToast(t('project.show.error', 'Error'), err)
    error.value = t('project.show.error', 'Failed to load project')
  } finally {
    loading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await projectService.update(projectId, values)
    toast.success(t('project.edit.success', 'Project updated successfully'))
    resetForm()
    await router.push(`/projects/${projectId}/show/overview`)
  } catch (error: unknown) {
    console.error('[EditProjectPage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('project.edit.error', 'Could not edit project'), error)
  }
})

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      :title="t('project.add.title')"
      back-link="/projects"
    >
      <template #back-link-text>
        {{ t('project.title') }}
      </template>

      <template #sidebar>
        <ProjectSidebar :project-id :project="project" />
      </template>

      <template #content>
        <div class="p-6 md:p-8 border rounded-md shadow-lg">
          <form class="flex flex-col gap-y-2 gap-x-8" @submit.prevent="onSubmit">
            <FormFieldLabeled
              v-slot="{ componentField }"
              name="name"
              :label="t('project.fields.name')"
              :disabled="isSubmitting"
            >
              <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <FormFieldLabeled
              name="type"
              :label="t('project.fields.type')"
              :disabled="isSubmitting"
            >
              <ProjectTypePicker
                :model-value="values.type"
                @update:model-value="setFieldValue('type', $event ?? 'project')"
              />
            </FormFieldLabeled>

            <FormFieldLabeled
              v-slot="{ componentField }"
              name="description"
              :label="t('project.fields.description')"
              :disabled="isSubmitting"
            >
              <Textarea v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormFieldLabeled
                v-slot="{ componentField }"
                name="priceNet"
                :label="t('project.fields.price')"
                :disabled="isSubmitting"
              >
                <Input
                  v-bind="componentField"
                  type="number"
                  step="0.01"
                  class="bg-white/50 dark:bg-black/50"
                />
              </FormFieldLabeled>
              <FormFieldLabeled
                name="unitId"
                :label="t('project.fields.unit')"
                :disabled="isSubmitting"
              >
                <MeasurementUnitPicker
                  :id="values.unitId"
                  :model-value="values.unit"
                  @update:model-value="setFieldValue('unit', $event)"
                  @update:id="setFieldValue('unitId', $event)"
                />
              </FormFieldLabeled>
              <FormFieldLabeled
                name="vatRateId"
                :label="t('project.fields.vatRate')"
                :disabled="isSubmitting"
              >
                <VatRatePicker
                  :id="values.vatRateId"
                  :model-value="values.vatRate"
                  @update:model-value="setFieldValue('vatRate', $event)"
                  @update:id="setFieldValue('vatRateId', $event)"
                />
              </FormFieldLabeled>
            </div>

            <div class="col-span-2">
              <Button type="submit" :disabled="isSubmitting" class="w-full">
                {{ t('project.add.title') }}
              </Button>
            </div>
          </form>
        </div>
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>

