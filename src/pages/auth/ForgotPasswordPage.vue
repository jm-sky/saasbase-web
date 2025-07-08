<script setup lang="ts">
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast'
import { authService } from '@/domains/auth/services/authService'
import { type ForgotPasswordData } from '@/domains/auth/types/auth.type'
import { forgotPasswordSchema } from '@/domains/auth/validation/auth.schema'
import { useRepatcha } from '@/domains/shared/composables/useRepatcha'
import GuestLayout from '@/layouts/GuestLayout.vue'

const { t } = useI18n()
const router = useRouter()
const { toast } = useToast()

const { isSubmitting, handleSubmit } = useForm<ForgotPasswordData>({
  validationSchema: forgotPasswordSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const token = await useRepatcha().getToken('forgot_password')
    values.recaptchaToken = token

    await authService.sendResetLinkEmail(values)

    toast.success(t('auth.forgotPassword.success'))

    await router.push('/')
  } catch (error: unknown) {
    toast.error(t('auth.forgotPassword.error'), {
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
          {{ t('auth.forgotPassword.title') }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ t('auth.forgotPassword.description') }}
        </p>
        <p class="text-sm text-muted-foreground">
          ...{{ t('common.or') }}
          <RouterLink to="/login" as="template">
            <Button variant="link" class="p-0">
              {{ t('auth.signIn') }}
            </Button>
          </RouterLink>
        </p>
      </div>

      <form class="mb-2 grid gap-2" @submit="onSubmit">
        <FormFieldLabeled v-slot="{ componentField }" name="email">
          <Input
            v-bind="componentField"
            placeholder="name@example.com"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <Button :disabled="isSubmitting" type="submit" :loading="isSubmitting">
          {{ t('auth.forgotPassword.submit') }}
        </Button>
      </form>
    </div>
  </GuestLayout>
</template>
