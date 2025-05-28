<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import { toast } from '@/components/ui/toast'
import { authService } from '@/domains/auth/services/authService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import GuestLayout from '@/layouts/GuestLayout.vue'

const TIMEOUT = 3000

const { jwtToken } = useRoute().query

const error = ref('')

const router = useRouter()
const authStore = useAuthStore()

const redirect = () => setTimeout(() => router.push('/'), TIMEOUT)

const processOAuth2Callback = async () => {
  if (!jwtToken) {
    toast.error('Invalid OAuth2 callback')
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
          OAuth
        </h1>

        <Alert v-if="error" variant="destructive">
          {{ error }}
        </Alert>

        <div class="opacity-80">
          <LoadingIcon />
          Redirecting...
        </div>
      </div>
    </div>
  </GuestLayout>
</template>