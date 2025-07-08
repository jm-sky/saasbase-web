<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import RichTextEditor from '@/components/Inputs/RichTextEditor.vue'
import Button from '@/components/ui/button/Button.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IComment, ICommentService } from '../types/comment.type'

const  { t } = useI18n()
const loading = ref(false)
const html = ref('To jest mój pierwszy post')

const { commentableId, service } = defineProps<{
  commentableId: string
  service: ICommentService
}>()

const emit = defineEmits<{
  create: [comment: IComment]
}>()

const { values, handleSubmit, setErrors, isSubmitting, setFieldValue, resetForm } = useForm({
  initialValues: {
    content: '',
  },
})

const reset = () => {
  resetForm()
  html.value = ''
}

const handleAdd = handleSubmit(async (values) => {
  try {
    loading.value = true
    const comment = await service.create(commentableId, values.content)
    reset()
    emit('create', comment)
  } catch (error: unknown) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('comments.add.error'), error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <form class="flex flex-col gap-2" @submit="handleAdd">
    <FormFieldLabeled
      v-slot="{ componentField }"
      name="content"
      :label="t('comments.add.label')"
    >
      <RichTextEditor
        v-model="html"
        :name="componentField.name"
        @update:markdown="setFieldValue('content', $event)"
      />
    </FormFieldLabeled>
    <Button
      :disabled="!values.content || isSubmitting"
      :loading="isSubmitting"
      type="submit"
    >
      {{ t('common.add') }}
    </Button>
  </form>
</template>