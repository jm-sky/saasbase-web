<script setup lang="ts">
import UserAuthForm from '@/components/Auth/UserAuthForm.vue';
import UIIcon from '@/components/UIIcon.vue';
</script>

<template>
  <div class="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-primary-950" />
      <div class="relative z-20 flex flex-col items-center gap-5 h-full justify-center text-lg font-medium">
        <UIIcon
          icon="lucide:rocket"
          class="text-6xl text-primary"
        />
        <div class="text-4xl font-bold">
          YOUR app
        </div>
        <p class="text-white/85">
          You should login before accessing the full content of our app...
        </p>
      </div>
    </div>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Sign in
          </h1>
          <p class="text-sm text-muted-foreground">
            Enter your email below to create your account
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
    </div>
  </div>
</template>
