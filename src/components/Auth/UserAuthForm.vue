<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue';
import FormFieldLabeledAfter from '@/components/Form/FormFieldLabeledAfter.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import UIIcon from '@/components/UIIcon.vue';
import { cn } from '@/lib/utils';
import { authService, credentialsSchema, type Credentials } from '@/services/authService';
import { useToast } from '../ui/toast';

const router = useRouter();
const { toast } = useToast();

type AuthProvider = 'gitHub' | 'google' | 'facebook' | 'linkedIn'

const authProviders: Record<AuthProvider, boolean> = {
  gitHub: true,
  google: false,
  facebook: false,
  linkedIn: false,
};

const isLoading = ref(false);

const form = useForm<Credentials>({
  validationSchema: toTypedSchema(credentialsSchema),
});

const onSubmit = form.handleSubmit(async (values) => {
  toast({
    title: 'Logging in...',
    description: `Hello there ${values.email}`,
    variant: 'default',
  });

  isLoading.value = true;

  await authService.login(values);

  router.push('/');
});

const useAuthProviders = computed<boolean>(() => Object.values(authProviders).filter(v => v).length > 0);
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
          />
        </FormFieldLabeled>

        <FormFieldLabeled
          v-slot="{ componentField }"
          name="password"
        >
          <Input
            v-bind="componentField"
            placeholder="Your secret password"
          />
        </FormFieldLabeled>

        <div class="flex flex-row gap-3 items-center justify-between text-sm mb-4 text-gray-600">
          <FormFieldLabeledAfter
            v-slot="{ componentField }"
            name="remember"
            label="Remember"
          >
            <Checkbox v-bind="componentField" />
          </FormFieldLabeledAfter>

          <div class="">
            <RouterLink
              to="/password-forgot"
              class="text-sm text-gray-500 hover:text-primary-500"
            >
              Forgot password?
            </RouterLink>
          </div>
        </div>

        <Button :disabled="isLoading">
          <UIIcon
            v-if="isLoading"
            icon="lucide:loader-circle"
            class="mr-2 size-4 animate-spin"
          />
          Sign In with Email
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
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        :disabled="isLoading"
      >
        <UIIcon
          v-if="isLoading"
          icon="lucide:loader-circle"
          class="mr-2 size-4 animate-spin"
        />
        <UIIcon
          v-else
          icon="lucide:github"
          class="mr-2 size-4"
          disabled
        />
        GitHub
      </Button>
    </template>
  </div>
</template>
