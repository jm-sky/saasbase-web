<script setup lang="ts">
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { toast } from '@/components/ui/toast'
import ProjectSidebar from '@/domains/project/components/ProjectSidebar.vue'
import ProjectStatusPicker from '@/domains/project/components/ProjectStatusPicker.vue'
import { useCreateProject } from '@/domains/project/composables/useProjectMutations'
import { createProjectSchema } from '@/domains/project/validation/project.schema'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IProjectCreatePayload } from '@/domains/project/types/project.type'

const { t } = useI18n()
const router = useRouter()

const { mutateAsync: createProject } = useCreateProject()

const { values, isSubmitting, handleSubmit, setErrors, setFieldValue, resetForm } = useForm<IProjectCreatePayload>({
  validationSchema: createProjectSchema,
  initialValues: {
    name: '',
    description: '',
    statusId: '',
  },
})

const statusIdModel = computed({
  get: () => values.statusId || undefined,
  set: (value: string | undefined) => {
    void setFieldValue('statusId', value ?? '')
  },
})

const onSubmit = handleSubmit(async (formValues) => {
  try {
    const project = await createProject({
      name: formValues.name,
      description: formValues.description || undefined,
      statusId: formValues.statusId,
    })
    toast.success(t('project.add.success', 'Project added successfully'))
    resetForm()
    await router.push(`/projects/${project.id}/show/overview`)
  } catch (error: unknown) {
    console.error('[AddProjectPage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('project.add.error', 'Could not add project'), error)
  }
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      :title="t('project.add.title')"
      back-link="/projects"
      show-sidebar
    >
      <template #back-link-text>
        {{ t('project.title') }}
      </template>

      <template #sidebar>
        <ProjectSidebar disabled />
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
              v-slot="{ componentField }"
              name="description"
              :label="t('project.fields.description')"
              :disabled="isSubmitting"
            >
              <Textarea v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
            </FormFieldLabeled>

            <FormFieldLabeled
              name="statusId"
              :label="t('project.fields.status')"
              :disabled="isSubmitting"
            >
              <ProjectStatusPicker
                v-model:id="statusIdModel"
                pick-default
                :disabled="isSubmitting"
              />
            </FormFieldLabeled>

            <div>
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
