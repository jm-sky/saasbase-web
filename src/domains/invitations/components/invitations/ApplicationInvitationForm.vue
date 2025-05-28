<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { IApplicationInvitation } from '../../types/invitation.type'
import { applicationInvitationService } from '../../services/applicationInvitation.service'

const { t } = useI18n()

const emit = defineEmits<{
  sent: [IApplicationInvitation]
}>()

const { handleSubmit, isSubmitting, resetForm, setErrors } = useForm({
  validationSchema: toTypedSchema(z.object({
    email: z.string().email(),
    message: z.string().optional(),
  })),
  initialValues: {
    email: '',
    message: '',
  },
})

const sendInvitation = handleSubmit(async (values) => {
  try {
    const invitation = await applicationInvitationService.send({ email: values.email, message: values.message })
    emit('sent', invitation)
    resetForm()
  } catch (error: unknown) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('invitation.send.error'), error)
  } finally {
  }
})
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      {{ t('invitation.send.title') }}
    </h3>

    <form class="mt-4 space-y-4" @submit.prevent="sendInvitation">
      <FormFieldLabeled v-slot="{ componentField }" name="email" :label="t('invitation.send.email')">
        <Input
          v-bind="componentField"
          type="email"
          required
          :disabled="isSubmitting"
        />
      </FormFieldLabeled>

      <FormFieldLabeled v-slot="{ componentField }" name="message" :label="t('invitation.send.message')">
        <Textarea
          v-bind="componentField"
          type="message"
          required
          :disabled="isSubmitting"
        />
      </FormFieldLabeled>

      <Button
        type="submit"
        :disabled="isSubmitting"
        :loading="isSubmitting"
      >
        {{ t('invitation.send.submit') }}
      </Button>
    </form>
  </div>
</template>
