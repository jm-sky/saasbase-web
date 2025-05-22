<script setup lang="ts">
import { useForm } from 'vee-validate'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import PasswordInput from '@/components/Inputs/PasswordInput.vue'
import InvitationInfo from '@/components/invitation/InvitationInfo.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { authService } from '@/domains/auth/services/authService'
import { registrationSchema } from '@/domains/auth/validation/auth.schema'
import { useInvitation } from '@/domains/tenant/composables/useTenantInvitation'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { useNextRedirect } from '@/lib/useNextRedirect'
import { isValidationError } from '@/lib/validation'
import type { RegistrationData } from '@/domains/auth/types/auth.type'

const router = useRouter()
const { t } = useI18n()
const { toast } = useToast()
const { redirectTo } = useNextRedirect()
const { token, loading: invitationLoading, invitation, loadInvitation } = useInvitation()

const { isSubmitting, handleSubmit, setFieldValue, resetForm, setErrors } = useForm<RegistrationData>({
  validationSchema: registrationSchema,
  initialValues: {
    firstName: import.meta.env.VITE_DEFAULT_NAME ?? 'John',
    lastName: import.meta.env.VITE_DEFAULT_LAST_NAME ?? 'Doe',
    email: import.meta.env.VITE_DEFAULT_LOGIN ?? '',
    password: import.meta.env.VITE_DEFAULT_PASSWORD ?? '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await authService.register(values)

    toast({
      title: t('auth.register.success'),
      description: t('auth.register.successDescription'),
    })

    if (token) {
      await router.push(`/invitation/accept?next=${encodeURIComponent(redirectTo.value)}`)
    } else {
      await router.push(redirectTo.value)
    }

  } catch (error: unknown) {
    console.error('[RegisterView][onSubmit] error:', error)
    handleErrorWithToast(t('auth.register.error'), error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
  }
})

onMounted(() => {
  if (token) {
    void loadInvitation()
  }
  if (invitation?.email) {
    setFieldValue('email', invitation.email)
  }
})
</script>

<template>
  <GuestLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col text-center space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ t('auth.register.title') }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ t('auth.register.description') }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ t('common.or') }}
          <ButtonLink to="/login">
            {{ t('auth.login.title') }}
          </ButtonLink>
        </p>
      </div>

      <div v-if="token && invitationLoading" class="text-center text-muted-foreground">
        {{ t('auth.register.loadingInvitation') }}
      </div>

      <InvitationInfo v-else-if="token || invitation" />

      <form class="flex flex-col gap-2" @submit="onSubmit">
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="firstName"
          :label="t('auth.fields.firstName')"
          :disabled="isSubmitting"
        >
          <Input
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="lastName"
          :label="t('auth.fields.lastName')"
          :disabled="isSubmitting"
        >
          <Input
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="email"
          :label="t('auth.fields.email')"
          :disabled="isSubmitting"
        >
          <Input
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="password"
          :label="t('auth.fields.password')"
          :disabled="isSubmitting"
        >
          <PasswordInput
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <Button
          type="submit"
          class="w-full mt-4"
          :disabled="isSubmitting"
          :loading="isSubmitting"
        >
          {{ t('auth.register.submit') }}
        </Button>

        <Button
          type="button"
          variant="outline"
          class="w-full"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="resetForm()"
        >
          Reset
        </Button>
      </form>

      <p class="text-center text-sm text-muted-foreground">
        {{ t('auth.termsAgree') }}
        <RouterLink
          to="/terms"
          class="font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          {{ t('auth.termsOfService') }}
        </RouterLink>
        {{ t('auth.and') }}
        <RouterLink
          to="/privacy"
          class="font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          {{ t('auth.privacyPolicy') }}
        </RouterLink>
        .
      </p>
    </div>
  </GuestLayout>
</template>
