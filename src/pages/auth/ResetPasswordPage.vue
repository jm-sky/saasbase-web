<script setup lang="ts">
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import PasswordInput from '@/components/Inputs/PasswordInput.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertDescription from '@/components/ui/alert/AlertDescription.vue'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast'
import { authService } from '@/domains/auth/services/authService'
import { type ResetPasswordData } from '@/domains/auth/types/auth.type'
import { resetPasswordSchema } from '@/domains/auth/validation/auth.schema'
import { useRepatcha } from '@/domains/shared/composables/useRepatcha'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { routeTo } from '@/router/routeMap'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const token = route.query.token as string
const email = route.query.email as string

const { isSubmitting, handleSubmit, errors } = useForm<ResetPasswordData>({
  validationSchema: resetPasswordSchema,
  initialValues: {
    token,
    email,
    password: '',
    passwordConfirmation: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const token = await useRepatcha().getToken('reset_password')
    values.recaptchaToken = token

    await authService.resetPassword(values)

    toast.success(t('auth.resetPassword.success'))

    await router.push(routeTo.login())
  } catch (error: unknown) {
    toast.error(t('auth.resetPassword.error'), {
      description: isAxiosError(error) ? error.message : '',
    })
  }
})
</script>

<template>
  <GuestLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col text-center">
        <h1 class="text-2xl font-semibold tracking-tight mb-2">
          {{ t('auth.resetPassword.title') }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ t('auth.resetPassword.description') }}
        </p>
      </div>

      <form class="mb-2 grid gap-2" @submit.prevent="onSubmit">
        <FormFieldLabeled
          v-slot="{ componentField }"
          :label="t('auth.fields.email')"
          name="email"
          disabled
        >
          <Input
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>
        <FormFieldLabeled v-slot="{ componentField }" :label="t('auth.fields.newPassword')" name="password">
          <PasswordInput
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>
        <FormFieldLabeled v-slot="{ componentField }" :label="t('auth.fields.newPasswordConfirmation')" name="passwordConfirmation">
          <PasswordInput
            v-bind="componentField"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <Button :disabled="isSubmitting" type="submit" :loading="isSubmitting">
          {{ t('auth.resetPassword.submit') }}
        </Button>

        <Alert v-if="errors.token" variant="destructive">
          <AlertDescription>
            {{ errors.token }}
          </AlertDescription>
        </Alert>
      </form>
    </div>
  </GuestLayout>
</template>
