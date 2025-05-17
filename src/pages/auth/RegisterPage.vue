<script setup lang="ts">
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import UIIcon from '@/components/UIIcon.vue'
import { useInvitation } from '@/composables/useInvitation'
import { authService } from '@/domains/auth/services/authService'
import { registrationSchema } from '@/domains/auth/validation/auth.schema'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { isValidationError } from '@/lib/validation'
import type { RegistrationData } from '@/domains/auth/types/auth.type'

const router = useRouter()
const { t } = useI18n()
const { toast } = useToast()
const { token, invitation, loading: invitationLoading, loadInvitation, acceptInvitation } = useInvitation()

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

    if (token) {
      await acceptInvitation()
    }

    toast({
      title: t('auth.register.success'),
      description: t('auth.register.successDescription'),
    })

    await router.push('/')

  } catch (error: unknown) {
    console.error('[RegisterView][onSubmit] error:', error)
    if (isValidationError(error)) setErrors(error.response.data.errors)
    toast({
      title: 'Error',
      description: `${isAxiosError(error) && error.response?.data?.message ? error.response.data.message : 'Registration error'}`,
      variant: 'destructive',
    })
  }
})

onMounted(() => {
  if (token) {
    void loadInvitation()
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
          ...or
          <ButtonLink to="/login">
            login
          </ButtonLink>
        </p>
      </div>

      <div v-if="token && invitationLoading" class="text-center text-muted-foreground">
        {{ t('auth.register.loadingInvitation') }}
      </div>

      <div v-else-if="token && invitation" class="rounded-lg border p-4 bg-muted">
        <div class="text-sm font-medium">
          {{ t('auth.register.invitationTitle') }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ t('auth.register.invitationDescription', { email: invitation.email, role: invitation.role }) }}
        </div>
      </div>

      <div v-else-if="token && !invitation" class="rounded-lg border p-4 bg-destructive/10">
        <div class="text-sm font-medium text-destructive">
          {{ t('auth.register.invitationError') }}
        </div>
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
