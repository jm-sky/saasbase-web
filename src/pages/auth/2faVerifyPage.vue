<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PinInput } from '@/components/ui/pin-input'
import { useToast } from '@/components/ui/toast'
import UIIcon from '@/components/UIIcon.vue'
import { mfaService } from '@/domains/auth/services/mfaService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import GuestLayout from '@/layouts/GuestLayout.vue'

const { t } = useI18n()
const router = useRouter()
const { toast } = useToast()
const authStore = useAuthStore()

const { values, isSubmitting, handleSubmit } = useForm({
  initialValues: {
    code: Array(6).fill(''),
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const { accessToken } = await mfaService.verify2fa(values.code.join(''))
    // Without this the old mfa=1 token stays in localStorage — every
    // subsequent request keeps getting rejected with the same
    // "verify 2FA" error even though verification just succeeded.
    authStore.setToken(accessToken)
    await router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('2FA verification failed:', error)
    toast.error(t('common.error'), {
      description: t('auth.2faVerificationFailed'),
    })
  }
})
</script>

<template>
  <GuestLayout>
    <div class="container mx-auto py-6">
      <Card class="max-w-md mx-auto bg-transparent border-none">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UIIcon icon="lucide:shield" class="size-5" />
            {{ t('auth.2faTitle') }}
          </CardTitle>
          <CardDescription>
            {{ t('auth.2faDescription') }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit="onSubmit">
            <PinInput
              v-model="values.code"
              :length="6"
              :disabled="isSubmitting"
              class="w-full"
            />

            <Button
              type="submit"
              :disabled="isSubmitting"
              class="w-full"
            >
              <UIIcon
                v-if="isSubmitting"
                icon="lucide:loader-circle"
                class="mr-2 size-4 animate-spin"
              />
              {{ t('auth.verifyCode') }}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </GuestLayout>
</template>
