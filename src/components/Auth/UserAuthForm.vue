<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import FormFieldLabeledAfter from '@/components/Form/FormFieldLabeledAfter.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import UIIcon from '@/components/UIIcon.vue'
import { config } from '@/config'
import { cn } from '@/lib/utils'
import { authService, type Credentials, credentialsSchema } from '@/services/authService'
import { useToast } from '../ui/toast'

const router = useRouter()
const { toast } = useToast()

const { setErrors, isSubmitting, handleSubmit } = useForm<Credentials>({
  validationSchema: toTypedSchema(credentialsSchema),
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
    setErrors({
      email: 'Invalid credentials',
      password: 'Invalid credentials',
    })
    toast.error({
      title: 'Error',
      description: `Invalid credentials. ${isAxiosError(error) ? error.message : ''}`,
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
            placeholder="name@example.com"
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
            placeholder="Your secret password"
            class="bg-white/50 dark:bg-black/50"
          />
        </FormFieldLabeled>

        <div class="flex flex-row gap-3 items-center justify-between text-sm mb-4 text-gray-600">
          <FormFieldLabeledAfter
            v-slot="{ componentField }"
            name="remember"
            label="Remember me"
          >
            <Checkbox v-bind="componentField" />
          </FormFieldLabeledAfter>

          <div class="">
            <RouterLink
              to="/password-forgot"
              class="text-sm font-bold text-gray-500 hover:text-primary-500"
            >
              Forgot password?
            </RouterLink>
          </div>
        </div>

        <Button :disabled="isSubmitting">
          <UIIcon
            v-if="isSubmitting"
            icon="lucide:loader-circle"
            class="mr-2 size-4 animate-spin"
          />
          Sign In with Email
        </Button>
      </div>
    </form>

    <template v-if="useAuthProviders">
      <div class="flex flex-row justify-center items-center">
        <div class="border-b grow" />
        <div class="backdrop-blur-md rounded-lg py-0.5 px-2 text-xs uppercase text-muted-foreground">
          Or continue with
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
