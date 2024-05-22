<script setup lang="ts">
import { RouterLink } from 'vue-router';
import UserAuthForm from '@/components/Auth/UserAuthForm.vue';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/GuestLayout.vue';
</script>

<template>
  <GuestLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col text-center">
        <h1 class="text-2xl font-semibold tracking-tight mb-2">
          Sign in
        </h1>
        <p class="text-sm text-muted-foreground">
          Enter Your credentials below to login
        </p>
        <p class="text-sm text-muted-foreground">
          ...or
          <RouterLink
            to="/register"
            as="template"
          >
            <Button
              variant="link"
              class="p-0"
            >
              Create new account
            </Button>
          </RouterLink>
        </p>
      </div>
        
      <UserAuthForm />

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
