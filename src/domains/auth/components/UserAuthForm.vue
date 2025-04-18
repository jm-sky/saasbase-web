<script setup lang="ts">
import { AxiosError, isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import FormFieldLabeledAfter from '@/components/Form/FormFieldLabeledAfter.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import UIIcon from '@/components/UIIcon.vue'
import { config } from '@/config'
import { authService } from '@/domains/auth/services/authService'
import { credentialsSchema } from '@/domains/auth/validation/auth.schema'
import { cn } from '@/lib/utils'
import type { Credentials } from '@/domains/auth/types/auth.type'

interface AuthErrorResponse {
  message?: string
}

const isAuthError = (error: unknown): error is AxiosError<AuthErrorResponse> => isAxiosError(error)

const router = useRouter()
const { t } = useI18n()
const { toast } = useToast()

const { setErrors, isSubmitting, handleSubmit } = useForm<Credentials>({
  validationSchema: credentialsSchema,
  initialValues: {
    email: import.meta.env.VITE_DEFAULT_LOGIN ?? '',
    password: import.meta.env.VITE_DEFAULT_PASSWORD ?? '',
    remember: false,
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await authService.login(values)
    await router.push('/')

  } catch (error: unknown) {
    console.warn('[LoginError]', error)
    setErrors({
      email: t('auth.invalidCredentials'),
      password: t('auth.invalidCredentials'),
    })
    toast.error(t('common.error'), {
      description: isAuthError(error) ? error.response?.data.message ?? error.message : t('auth.invalidCredentials'),
    })
  }
})

const useAuthProviders = computed<boolean>(() => Object.values(config.auth.providers).filter(v => v).length > 0)
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="email"
        >
          <Input
            v-bind="componentField"
            autocomplete="username"
            :placeholder="t('auth.emailPlaceholder')"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="password"
        >
          <Input
            v-bind="componentField"
            type="password"
            autocomplete="current-password"
            :placeholder="t('auth.passwordPlaceholder')"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <div class="flex flex-row gap-3 items-center justify-between text-sm mb-4 text-gray-600">
          <FormFieldLabeledAfter
            v-slot="{ componentField }"
            name="remember"
            :label="t('auth.rememberMe')"
          >
            <Checkbox v-bind="componentField" />
          </FormFieldLabeledAfter>

          <div class="">
            <RouterLink
              to="/password-forgot"
              class="text-sm font-bold text-gray-500 hover:text-primary"
            >
              {{ t('auth.forgotPassword') }}
            </RouterLink>
          </div>
        </div>

        <Button :disabled="isSubmitting">
          <UIIcon
            v-if="isSubmitting"
            icon="lucide:loader-circle"
            class="mr-2 size-4 animate-spin"
          />
          {{ t('auth.signInWithEmail') }}
        </Button>
      </div>
    </form>

    <template v-if="useAuthProviders">
      <div class="flex flex-row justify-center items-center">
        <div class="border-b grow" />
        <div class="backdrop-blur-md rounded-lg py-0.5 px-2 text-xs uppercase text-muted-foreground">
          {{ t('auth.continueWith') }}
        </div>
        <div class="border-b grow" />
      </div>
      <Button
        variant="outline"
        type="button"
        disabled
      >
        <UIIcon
          v-if="isSubmitting"
          icon="lucide:loader-circle"
          class="mr-2 size-4 animate-spin"
        />
        <UIIcon
          v-else
          icon="lucide:github"
          class="mr-2 size-4"
        />
        GitHub
      </Button>
    </template>
  </div>
</template>
