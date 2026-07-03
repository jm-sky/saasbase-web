<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import { toast } from '@/components/ui/toast'
import { authService } from '@/domains/auth/services/authService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import GuestLayout from '@/layouts/GuestLayout.vue'

const TIMEOUT = 3000

const { t } = useI18n()
const { jwtToken, error: queryError } = useRoute().query

const error = ref('')

const router = useRouter()
const authStore = useAuthStore()

const redirect = () => setTimeout(() => router.push('/'), TIMEOUT)

const processOAuth2Callback = async () => {
  // The backend redirects here with ?error=account_exists (instead of a
  // token) when the email is already registered under a different sign-in
  // method — this was previously silently ignored, so the user only ever
  // saw a generic "invalid callback" toast with no explanation.
  if (queryError === 'account_exists') {
    error.value = t('auth.oauth.accountExists')
    redirect()
    return
  }

  if (!jwtToken) {
    error.value = t('auth.oauth.invalidCallback')
    toast.error(t('auth.oauth.invalidCallback'))
    redirect()
    return
  }

  authStore.setToken(jwtToken as string)
  authStore.setUser(await authService.getMe())
  redirect()
}

onMounted(async () => {
  await processOAuth2Callback()
})
</script>

<template>
  <GuestLayout>
    <div class="mx-auto flex w-full flex-col justify-center space-y-6">
      <div class="flex flex-col text-center space-y-4 px-6">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ t('auth.oauth.title') }}
        </h1>

        <Alert v-if="error" variant="destructive">
          {{ error }}
        </Alert>

        <div class="flex flex-col items-center justify-center gap-4 opacity-80">
          <LoadingIcon />
          {{ t('auth.oauth.redirecting') }}
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
