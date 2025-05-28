<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import RoleLookup from '@/domains/rights/components/RoleLookup.vue'
import { tenantInvitationService } from '@/domains/tenant/services/TenantInvitationService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { ITenantInvitation } from '@/domains/tenant/types/invitation.type'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const props = defineProps<{
  tenant: ITenant
}>()

const { t } = useI18n()

const emit = defineEmits<{
  sent: [ITenantInvitation]
}>()

const { handleSubmit, values, isSubmitting, resetForm, setErrors } = useForm({
  validationSchema: toTypedSchema(z.object({
    email: z.string().email(),
    role: z.string(),
  })),
  initialValues: {
    email: '',
    role: '',
  },
})

const sendInvitation = handleSubmit(async (values) => {
  try {
    const invitation = await tenantInvitationService.send(props.tenant.id, {
      email: values.email,
      role: values.role,
    })
    emit('sent', invitation)
    resetForm()
  } catch (error: unknown) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('tenant.invitations.send.error'), error)
  } finally {
  }
})
</script>

<template>
  <div class="rounded-lg border p-4">
    <h3 class="text-lg font-medium">
      {{ t('tenant.invitations.send.title') }}
    </h3>

    <form class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" @submit.prevent="sendInvitation">
      <FormFieldLabeled v-slot="{ componentField }" name="email" :label="t('tenant.invitations.send.email')">
        <Input
          v-bind="componentField"
          type="email"
          required
          :disabled="isSubmitting"
        />
      </FormFieldLabeled>
      <FormFieldLabeled v-slot="{ componentField }" name="role" :label="t('tenant.invitations.send.role')">
        <RoleLookup
          :model-value="values.role"
          v-bind="componentField"
          popover-content-class="w-full md:w-xl"
          :disabled="isSubmitting"
        />
      </FormFieldLabeled>

      <div class="col-span-full">
        <Button
          type="submit"
          class="w-full"
          :disabled="isSubmitting"
          :loading="isSubmitting"
        >
          {{ t('tenant.invitations.send.submit') }}
        </Button>
      </div>
    </form>
  </div>
</template>
