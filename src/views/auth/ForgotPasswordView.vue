<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { isAxiosError } from 'axios';
import { useForm } from 'vee-validate';
import { RouterLink, useRouter } from 'vue-router';
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input/Input.vue';
import { useToast } from '@/components/ui/toast';
import UIIcon from '@/components/UIIcon.vue';
import GuestLayout from '@/layouts/GuestLayout.vue';
import { authService, resetPasswordSchema, type ResetPasswordData } from '@/services/authService';

const router = useRouter();
const { toast } = useToast();

const { isSubmitting, handleSubmit } = useForm<ResetPasswordData>({
  validationSchema: toTypedSchema(resetPasswordSchema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await authService.resetPassword(values);
  
    router.push('/');

    toast({
      title: 'Success',
      description: `E-mail with instructions has been sent to ${values.email}`,
      variant: 'success',
    });

  } catch (error: unknown) {
    toast({
      title: 'Error',
      description: `Invalid credentials. ${isAxiosError(error) ? error.message : ''}`,
      variant: 'destructive',
    });
  }
});
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
          <RouterLink
            to="/login"
            as="template"
          >
            <Button
              variant="link"
              class="p-0"
            >
              login
            </Button>
          </RouterLink>
        </p>
      </div>
        
      <form @submit="onSubmit">
        <div class="grid gap-2">
          <FormFieldLabeled
            v-slot="{ componentField }"
            name="email"
          >
            <Input
              v-bind="componentField"
              placeholder="name@example.com"
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
        </div>
      </form>
    </div>
  </GuestLayout>
</template>
