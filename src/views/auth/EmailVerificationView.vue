<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { verifyEmail } from '@/domains/auth/services/verifyEmail'
import GuestLayout from '@/layouts/GuestLayout.vue'

const route = useRoute()
const router = useRouter()
const isVerified = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const { id, hash } = route.params
    await verifyEmail({ id: id as string, hash: hash as string })
    isVerified.value = true
    // Redirect to login after 2 seconds
    setTimeout(async () => {
      await router.push('/login')
    }, 2000)
  } catch (err) {
    console.error('Email verification failed:', err)
    error.value = 'Failed to verify email. The link might be expired or invalid.'
  }
})
</script>

<template>
  <GuestLayout>
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Email Verification
        </h2>
        <div class="mt-4 text-center">
          <template v-if="error">
            <p class="text-red-600">{{ error }}</p>
          </template>
          <template v-else-if="isVerified">
            <p class="text-green-600">Your email has been verified successfully!</p>
            <p class="mt-2 text-gray-600">Redirecting to login...</p>
          </template>
          <template v-else>
            <p class="text-gray-600">Confirming your email address...</p>
          </template>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
