<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import InvitationInfo from '@/components/invitation/InvitationInfo.vue'
import { useInvitation } from '@/composables/useInvitation'
import PrettyUserAuthForm from '@/domains/auth/components/UserAuthForm.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { useNextRedirect } from '@/lib/useNextRedirect'

const { t } = useI18n()
const router = useRouter()
const { redirectTo } = useNextRedirect()
const { token, loading: invitationLoading, loadInvitation } = useInvitation()

const handleLoggedIn = async () => {
  if (token) {
    await router.push(`/invitation/accept?next=${encodeURIComponent(redirectTo.value)}`)
  } else {
    await router.push(redirectTo.value)
  }
}


onMounted(() => {
  if (token) {
    void loadInvitation()
  }
})
</script>

<template>
  <GuestLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6">
      <div class="flex flex-col text-center space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ t('auth.login.title') }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ t('auth.login.description') }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ t('common.or') }}
          <ButtonLink to="/register" class="font-semibold transition-colors hover:text-primary">
            {{ t('auth.createAccount') }}
          </ButtonLink>
        </p>
      </div>

      <div v-if="token && invitationLoading" class="text-center text-muted-foreground">
        {{ t('auth.login.loadingInvitation') }}
      </div>

      <InvitationInfo v-else-if="token" />

      <PrettyUserAuthForm @logged-in="handleLoggedIn" />

      <p class="text-center text-sm text-muted-foreground">
        {{ t('auth.termsAgree') }}
        <RouterLink
          to="/terms"
          class="font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          {{ t('auth.termsOfService') }}
        </RouterLink>
        {{ t('auth.and') }}
        <RouterLink
          to="/privacy"
          class="font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          {{ t('auth.privacyPolicy') }}
        </RouterLink>
        .
      </p>
    </div>
  </GuestLayout>
</template>
