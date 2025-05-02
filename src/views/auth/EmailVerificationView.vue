<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import { verifyEmail } from '@/domains/auth/services/verifyEmail'
import GuestLayout from '@/layouts/GuestLayout.vue'

const REDIRECT_DELAY = 4000

const route = useRoute()
const router = useRouter()
const isVerified = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const email = route.query.email as string
    const token = route.query.token as string

    if (!email || !token) {
      throw new Error('Missing email or token')
    }

    await verifyEmail({ email, token })
    isVerified.value = true

    setTimeout(async () => await router.push('/login'), REDIRECT_DELAY)
  } catch (err) {
    console.error('Email verification failed:', err)
    error.value = 'Failed to verify email. The link might be expired or invalid.'
  }
})
</script>

<template>
  <GuestLayout>
    <div class="flex min-h-full flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Email Verification
        </h2>
        <div class="mt-8 text-center">
          <div v-if="error" class="px-4 py-2 text-red-600 rounded-md bg-red-50/80">
            {{ error }}
          </div>
          <div v-else-if="isVerified" class="px-4 py-2 text-green-600 rounded-md bg-green-50/80">
            <p class="font-medium">
              Your email has been verified successfully!
            </p>
            <p class="mt-2 text-gray-600">
              Redirecting to login...
            </p>
          </div>
          <template v-else>
            <p class="text-gray-600">
              Confirming your email address...
            </p>
          </template>

          <ButtonLink to="/login" class="mt-6">
            Go to login
          </ButtonLink>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
