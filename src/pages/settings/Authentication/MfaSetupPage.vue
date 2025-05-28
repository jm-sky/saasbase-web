<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { Form } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PinInput, PinInputGroup, PinInputSlot } from '@/components/ui/pin-input'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/toast'
import { authService } from '@/domains/auth/services/authService'
import { mfaService } from '@/domains/auth/services/mfaService'
import { useAuthStore } from '@/domains/auth/store/auth.store'

const router = useRouter()
const authStore = useAuthStore()

interface Setup2FAResponse {
  secret: string
  qrCodeUrl: string
  recoveryCodes: string[]
}

const isLoading = ref(false)
const setupData = ref<Setup2FAResponse | null>(null)
const qrCode = computed(() => setupData.value?.qrCodeUrl ?? '')

const qrCodeUrl = useQRCode(qrCode)

const verificationSchema = toTypedSchema(
  z.object({
    code: z.array(z.string())
      .length(6, 'Code must be exactly 6 digits')
      .refine((val) => val.every((code) => code.length === 1), 'Each code must be exactly 1 digit') ,
  })
)

const setup2FA = async () => {
  try {
    isLoading.value = true
    setupData.value = await mfaService.setup2fa()
  } catch {
    toast({
      title: 'Error',
      description: 'Failed to setup 2FA. Please try again.',
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}

const code = ref<string[]>(Array(6).fill(''))
const error = ref<string>('')

const handleVerify = async () => {
  try {
    isLoading.value = true
    const { errors } = await verificationSchema.parse({ code: code.value})

    if (errors.length > 0) {
      error.value = errors[0].errors[0]
      return
    }

    await mfaService.enable2fa(code.value.join(''))

    const userData = await authService.getMe()
    authStore.setUser(userData)

    toast.success('Two-factor authentication has been enabled.')

    await router.push('/settings/account')
  } catch {
    toast.error('Invalid verification code. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const handleBack = async () => {
  await router.push('/settings/account')
}

onMounted(() => void setup2FA())
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-medium">
        Two-Factor Authentication Setup
      </h3>
      <p class="text-sm text-muted-foreground">
        Enhance your account security by setting up two-factor authentication.
      </p>
    </div>

    <Card v-if="setupData">
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
        <CardDescription>
          Scan this QR code with your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex justify-center">
          <img
            :src="qrCodeUrl"
            alt="2FA QR Code"
            class="w-64 h-64"
          >
        </div>
        <div class="mt-4">
          <p class="text-sm font-medium">
            Manual entry code:
          </p>
          <code class="block mt-1 p-2 bg-muted rounded">{{ setupData.secret }}</code>
        </div>
        <div class="mt-6">
          <p class="text-sm font-medium mb-2">
            Recovery Codes:
          </p>
          <div class="bg-muted p-4 rounded">
            <code v-for="(recoveryCode, index) in setupData.recoveryCodes" :key="index" class="block">
              {{ recoveryCode }}
            </code>
          </div>
          <p class="text-sm text-muted-foreground mt-2">
            Save these recovery codes in a secure location. They will allow you to access your account if you lose your 2FA device.
          </p>
        </div>

        <Separator class="my-6" />

        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium">
              Verify Setup
            </h4>
            <p class="text-sm text-muted-foreground">
              Enter the 6-digit code from your authenticator app to complete setup
            </p>
          </div>

          <Form class="space-y-4" @submit="handleVerify">
            <PinInput
              v-model="code"
              :disabled="isLoading"
              type="number"
              length="6"
              class="flex justify-center gap-2"
            >
              <PinInputGroup>
                <PinInputSlot
                  v-for="index in 6"
                  :key="index"
                  :index="index - 1"
                  class="w-10 h-10"
                  :class="{ 'border-red-500': error }"
                />
              </PinInputGroup>
            </PinInput>
            <div v-if="error" class="text-center text-xs text-red-500">
              {{ error }}
            </div>

            <div class="flex justify-between mt-6">
              <Button
                variant="outline"
                type="button"
                :disabled="isLoading"
                @click="handleBack"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                :disabled="isLoading"
              >
                Verify and Enable 2FA
              </Button>
            </div>
          </Form>
        </div>
      </CardContent>
    </Card>

    <div v-else class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  </div>
</template>
