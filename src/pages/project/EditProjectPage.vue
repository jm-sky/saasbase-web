<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { toast } from '@/components/ui/toast'
import ProjectSidebar from '@/domains/project/components/ProjectSidebar.vue'
import { useUpdateProject } from '@/domains/project/composables/useProjectMutations'
import { useProject } from '@/domains/project/composables/useProjectQueries'
import { useProjectStore } from '@/domains/project/stores/project.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IProjectCreate } from '@/domains/project/types/project.type'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const projectId = route.params.id as string
const projectStore = useProjectStore()
const { project: storeProject } = storeToRefs(projectStore)

const { data: project, isPending: loading, refetch } = useProject(projectId)
const { mutateAsync: updateProject } = useUpdateProject()

const { isSubmitting, handleSubmit, setValues, setErrors, resetForm } = useForm<IProjectCreate>({
  initialValues: {
    name: '',
    description: '',
  },
})

watch(project, (value) => {
  if (!value) return
  projectStore.setProject(value)
  setValues({
    name: value.name,
    description: value.description,
  })
}, { immediate: true })

const displayProject = computed(() => project.value ?? storeProject.value)

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateProject({ id: projectId, data: values })
    toast.success(t('project.edit.success', 'Project updated successfully'))
    resetForm()
    await router.push(`/projects/${projectId}/show/overview`)
  } catch (error: unknown) {
    console.error('[EditProjectPage][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('project.edit.error', 'Could not edit project'), error)
  }
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      :title="t('project.edit.title')"
      back-link="/projects"
      :name="displayProject?.name"
      :logo="displayProject?.logoUrl"
      :loading
      show-sidebar
      @refresh="refetch()"
    >
      <template #back-link-text>
        {{ t('project.title') }}
      </template>

      <template #sidebar>
        <ProjectSidebar :project-id="projectId" :project="displayProject" />
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

            <div>
              <Button type="submit" :disabled="isSubmitting" class="w-full">
                {{ t('common.save', 'Save') }}
              </Button>
            </div>
          </form>
        </div>
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
