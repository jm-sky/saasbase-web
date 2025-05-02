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
import { useLogin } from '@/composables/useLogin'
import { config } from '@/config'
import { credentialsSchema } from '@/domains/auth/validation/auth.schema'
import { cn } from '@/lib/utils'
import type { Credentials } from '@/domains/auth/types/auth.type'

interface AuthErrorResponse {
  message?: string
}

const isAuthError = (error: unknown): error is AxiosError<AuthErrorResponse> => isAxiosError(error)

const { t } = useI18n()
const { toast } = useToast()
const { login } = useLogin()
const router = useRouter()

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
    await login(values)
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
          <div class="relative">
            <UIIcon
              icon="lucide:mail"
              class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              v-bind="componentField"
              autocomplete="username"
              :placeholder="t('auth.emailPlaceholder')"
              class="bg-white/50 dark:bg-black/50 pl-10 transition-shadow"
            />
          </div>
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="password"
        >
          <div class="relative">
            <UIIcon
              icon="lucide:lock"
              class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              v-bind="componentField"
              type="password"
              autocomplete="current-password"
              :placeholder="t('auth.passwordPlaceholder')"
              class="bg-white/50 dark:bg-black/50 pl-10 transition-shadow"
            />
          </div>
        </FormFieldLabeled>

        <div class="flex flex-row gap-3 items-center justify-between text-sm mb-4">
          <FormFieldLabeledAfter
            v-slot="{ componentField }"
            name="remember"
            :label="t('auth.rememberMe')"
          >
            <Checkbox v-bind="componentField" class="transition-shadow" />
          </FormFieldLabeledAfter>

          <div>
            <RouterLink
              to="/password-forgot"
              class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {{ t('auth.forgotPassword') }}
            </RouterLink>
          </div>
        </div>

        <Button
          :disabled="isSubmitting"
          class="w-full transition-all duration-200 hover:shadow-md"
        >
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
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground">
            {{ t('auth.continueWith') }}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        :disabled="isSubmitting"
        class="w-full transition-all duration-200 hover:shadow-md"
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
