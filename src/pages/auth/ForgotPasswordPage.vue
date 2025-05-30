<script setup lang="ts">
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { RouterLink, useRouter } from 'vue-router'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast'
import UIIcon from '@/components/UIIcon.vue'
import { authService } from '@/domains/auth/services/authService'
import { type ResetPasswordData } from '@/domains/auth/types/auth.type'
import { resetPasswordSchema } from '@/domains/auth/validation/auth.schema'
import GuestLayout from '@/layouts/GuestLayout.vue'

const router = useRouter()
const { toast } = useToast()

const { isSubmitting, handleSubmit } = useForm<ResetPasswordData>({
  validationSchema: resetPasswordSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await authService.resetPassword(values)

    await router.push('/')

    toast({
      title: 'Success',
      description: `E-mail with instructions has been sent to ${values.email}`,
      variant: 'success',
    })

  } catch (error: unknown) {
    toast({
      title: 'Error',
      description: `Invalid credentials. ${isAxiosError(error) ? error.message : ''}`,
      variant: 'destructive',
    })
  }
})
</script>

<template>
  <GuestLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col text-center">
        <h1 class="text-2xl font-semibold tracking-tight mb-2">
          Reset password
        </h1>
        <p class="text-sm text-muted-foreground">
          Enter Your e-mail below
        </p>
        <p class="text-sm text-muted-foreground">
          ...or
          <RouterLink to="/login" as="template">
            <Button variant="link" class="p-0">
              login
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

        <Button :disabled="isSubmitting">
          <UIIcon
            v-if="isSubmitting"
            icon="lucide:loader-circle"
            class="mr-2 size-4 animate-spin"
          />
          Send reset link
        </Button>
      </form>
    </div>
  </GuestLayout>
</template>
