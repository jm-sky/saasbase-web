<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { useLogout } from '@/composables/useLogout'
import { authService } from '@/domains/auth/services/authService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import GuestLayout from '@/layouts/GuestLayout.vue'

const authStore = useAuthStore()
const { logout } = useLogout()
const { toast } = useToast()

const loading = ref(false)

const handleResend = async () => {
  try {
    loading.value = true
    await authService.resendEmailVerification(`${authStore.userData?.email}`)
    toast.success('Verification email sent')
  } catch (error) {
    console.error(error)
    toast.error('Failed to resend verification email')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <GuestLayout>
    <div class="container mx-auto py-6">
      <Card class="max-w-md mx-auto bg-transparent border-none">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Mail class="h-5 w-5" />
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-4">
            <p class="text-sm text-muted-foreground">
              If you haven't received the email, check your spam folder or click the button below to resend the verification link.
            </p>
            <Button :disabled="loading" :loading @click="handleResend">
              Resend Verification Email
            </Button>

            <Button variant="outline" @click="logout">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </GuestLayout>
</template>
