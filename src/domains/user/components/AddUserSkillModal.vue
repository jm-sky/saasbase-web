<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import SkillLookup from '@/domains/skill/components/SkillLookup.vue'
import { userSkillService } from '@/domains/user/services/UserSkillService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IUserSkill } from '@/domains/user/types/user.type'

const { t } = useI18n()
const authStore = useAuthStore()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{ create: [IUserSkill] }>()

const schema = toTypedSchema(
  z.object({
    skill: z.string().min(1),
    skillId: z.string().min(1),
    level: z.number().int().min(1).max(5)
  })
)

const { handleSubmit, values, setFieldValue, setErrors, resetForm, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    skillId: '',
    skill: '',
    level: 1
  }
})

const onSubmit = handleSubmit(async (formValues) => {
  try {
    // Usuń userId — serwis korzysta z aktualnego użytkownika
    const userSkill = await userSkillService.add({
      userId: authStore.user?.id ?? '',
      skillId: formValues.skillId,
      level: formValues.level
    })
    emit('create', userSkill)
    open.value = false
  } catch (error) {
    handleErrorWithToast(t('skills.add.error'), error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
  }
})

watch(open, (newValue) => {
  if (newValue) {
    resetForm()
  }
})
</script>

<template>
  <ModalComponent
    size="md"
    :title="t('skills.add.title')"
    :description="t('skills.add.description')"
    :open="open"
    @update:open="open = $event"
  >
    <form
      class="grid grid-cols-1 gap-4"
      :class="{ 'opacity-50': isSubmitting }"
      @submit.prevent="onSubmit"
    >
      <FormFieldLabeled name="skill" :label="t('skills.fields.skill')">
        <SkillLookup
          :model-value="values.skill"
          :model-id="values.skillId"
          @update:model-id="setFieldValue('skillId', $event)"
          @update:model-value="setFieldValue('skill', $event)"
        />
      </FormFieldLabeled>

      <FormFieldLabeled name="level" :label="t('skills.fields.level')">
        <Input
          v-model.number="values.level"
          type="number"
          min="1"
          max="5"
        />
      </FormFieldLabeled>

      <Button
        type="submit"
        class="w-full"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      >
        {{ t('common.save') }}
      </Button>
    </form>
  </ModalComponent>
</template>
