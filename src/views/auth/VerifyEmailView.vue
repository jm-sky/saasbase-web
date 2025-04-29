<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogout } from '@/composables/useLogout'
import GuestLayout from '@/layouts/GuestLayout.vue'

const { logout } = useLogout()

const handleResend = () => {
  // TODO: Implement resend verification email
  console.log('Resend verification email')
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
            <Button @click="handleResend">
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
