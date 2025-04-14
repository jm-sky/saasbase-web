<script setup lang="ts">
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { RouterLink, useRouter } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import UIIcon from '@/components/UIIcon.vue'
import { authService } from '@/domains/auth/services/authService'
import { registrationSchema } from '@/domains/auth/validation/auth.schema'
import { isValidationError } from '@/helpers/validation'
import GuestLayout from '@/layouts/GuestLayout.vue'
import type { RegistrationData } from '@/domains/auth/types/auth.type'

const router = useRouter()
const { toast } = useToast()

const { isSubmitting, handleSubmit, resetForm, setErrors } = useForm<RegistrationData>({
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
    await router.push('/')

  } catch (error: unknown) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    toast({
      title: 'Error',
      description: `${isAxiosError(error) && error.response?.data?.message ? error.response.data.message : 'Registration error'}`,
      variant: 'destructive',
    })
  }
})
</script>

<template>
  <GuestLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col text-center space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">
          Register
        </h1>
        <p class="text-sm text-muted-foreground">
          Enter your account details below to create your account
        </p>
        <p class="text-sm text-muted-foreground">
          ...or
          <ButtonLink to="/login">
            login
          </ButtonLink>
        </p>
      </div>

      <form class="flex flex-col gap-2" @submit="onSubmit">
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="firstName"
          label="Name"
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
          label="Last name"
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
          label="E-mail"
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
          label="Password"
          :disabled="isSubmitting"
        >
          <Input
            type="password"
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
          <UIIcon
            v-if="isSubmitting"
            icon="lucide:loader-circle"
            class="mr-2 size-4 animate-spin"
          />
          Register
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

      <p class="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our
        <RouterLink
          to="/terms"
          class="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </RouterLink>
        and
        <RouterLink
          to="/privacy"
          class="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </RouterLink>
        .
      </p>
    </div>
  </GuestLayout>
</template>
