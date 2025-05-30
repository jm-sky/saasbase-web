<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'

import ModalComponent from '@/components/ModalComponent.vue'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import SkillLookup from '@/domains/skill/components/SkillLookup.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'

import { userSkillService } from '@/domains/user/services'
import type { IUserSkill } from '@/domains/user/types/user.type'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'

const { t } = useI18n()
const open = defineModel<boolean>('open', { required: true })

const { userId } = defineProps<{ userId: string }>()
const emit = defineEmits<{ create: [IUserSkill] }>()

const schema = toTypedSchema(
  z.object({
    skill: z.string().min(1),
    level: z.number().int().min(1).max(5)
  })
)

const { handleSubmit, values, setFieldValue, setErrors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    skill: '',
    level: 1
  }
})

const onSubmit = handleSubmit(async (formValues) => {
  try {
    const userSkill = await userSkillService.add(userId, formValues)
    emit('create', userSkill)
    open.value = false
  } catch (error) {
    if (isValidationError(error)) {
      setErrors(error.response.data.errors)
    }
    handleErrorWithToast(t('skills.add.error'), error)
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
          @update:model-value="setFieldValue('skill', $event)"
        />
      </FormFieldLabeled>

      <FormFieldLabeled name="level" :label="t('skills.fields.level')">
        <Input
          type="number"
          min="1"
          max="5"
          v-model.number="values.level"
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
