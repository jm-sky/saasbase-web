<script setup lang="ts">
import { computed } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UIIcon from '@/components/UIIcon.vue';
import { cn } from '@/lib/utils';

const router = useRouter();

type AuthProvider = 'gitHub' | 'google' | 'facebook' | 'linkedIn'

const authProviders: Record<AuthProvider, boolean> = {
  gitHub: false,
  google: false,
  facebook: false,
  linkedIn: false,
};

const isLoading = ref(false);

async function onSubmit(event: Event) {
  event.preventDefault();
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    router.push('/');
  }, 3000);
}

const useAuthProviders = computed<boolean>(() => Object.values(authProviders).filter(v => v).length > 0);
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label
            class="sr-only"
            for="email"
          >
            E-mail
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-1">
          <Label
            class="sr-only"
            for="password"
          >
            Password
          </Label>
          <Input
            id="password"
            placeholder="Your secret password"
            type="password"
            auto-capitalize="none"
            auto-complete="password"
            auto-correct="off"
            :disabled="isLoading"
          />
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
        />
        GitHub
      </Button>
    </template>
  </div>
</template>
