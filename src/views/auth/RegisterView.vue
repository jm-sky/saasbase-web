<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as z from 'zod';
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import { useToast } from '@/components/ui/toast/use-toast';
import GuestLayout from '@/layouts/GuestLayout.vue';

const { toast } = useToast();

const isLoading = ref(false);

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  password: z.string().min(8).max(50),
  email: z.string().email().min(4).max(50),
}));

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  toast({
    title: 'Registering...',
    description: `Hello there ${values.name}`,
    variant: 'success',
  });

  isLoading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  isLoading.value = false;
});
</script>

<template>
  <GuestLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col text-center">
        <h1 class="text-2xl font-semibold tracking-tight mb-2">
          Register
        </h1>
        <p class="text-sm text-muted-foreground">
          Enter your account details below to create your account
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
        
      <form
        class="flex flex-col gap-2"
        @submit="onSubmit"
      >
        <FormFieldLabeled
          v-slot="{ componentField }"
          name="name"
          label="Name"
        >
          <Input
            v-bind="componentField"
            class="bg-white/50"
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="lastName"
          label="Last name"
        >
          <Input
            v-bind="componentField"
            class="bg-white/50"
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="email"
          label="E-mail"
        >
          <Input
            v-bind="componentField"
            class="bg-white/50"
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="password"
          label="Password"
        >
          <Input
            type="password"
            v-bind="componentField"
            class="bg-white/50"
          />
        </FormFieldLabeled>

        <Button
          type="submit"
          class="w-full font-semibold"
          :loading="isLoading"
        >
          Register
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
