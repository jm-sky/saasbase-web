<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import UserAuthForm from '@/domains/auth/components/UserAuthForm.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'

const { t } = useI18n()
</script>

<template>
  <GuestLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col text-center space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ t('auth.signIn') }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ t('auth.enterCredentials') }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ t('common.or') }}
          <ButtonLink to="/register">
            {{ t('auth.createAccount') }}
          </ButtonLink>
        </p>
      </div>

      <UserAuthForm />

      <p class="px-8 text-center text-sm text-muted-foreground">
        {{ t('auth.termsAgree') }}
        <RouterLink
          to="/terms"
          class="underline underline-offset-4 hover:text-primary"
        >
          {{ t('auth.termsOfService') }}
        </RouterLink>
        {{ t('auth.and') }}
        <RouterLink
          to="/privacy"
          class="underline underline-offset-4 hover:text-primary"
        >
          {{ t('auth.privacyPolicy') }}
        </RouterLink>
        .
      </p>
    </div>
  </GuestLayout>
</template>
