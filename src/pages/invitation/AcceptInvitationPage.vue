<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import InvitationInfo from '@/components/invitation/InvitationInfo.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertDescription from '@/components/ui/alert/AlertDescription.vue'
import AlertTitle from '@/components/ui/alert/AlertTitle.vue'
import Button from '@/components/ui/button/Button.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { useInvitation } from '@/domains/tenant/composables/useTenantInvitation'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { useNextRedirect } from '@/lib/useNextRedirect'

const { t } = useI18n()
const { toast } = useToast()
const { redirectTo } = useNextRedirect()
const router = useRouter()
const authStore = useAuthStore()

const submitting = ref(false)

const { store, token, invitation, loading, error, loadInvitation, acceptInvitation, declineInvitation } = useInvitation()

const handleAccept = async () => {
  try {
    submitting.value = true
    const result = await acceptInvitation()
    if (result) {
      toast.success(t('invitation.accept.success'), {
        description: t('invitation.accept.successDescription'),
      })
      await router.push(redirectTo.value)
    }
  } catch (error) {
    handleErrorWithToast(t('invitation.accept.error'), error)
  } finally {
    submitting.value = false
  }
}

const handleDecline = async () => {
  try {
    submitting.value = true
    await declineInvitation()
    toast.success(t('invitation.decline.success'), {
      description: t('invitation.decline.successDescription'),
    })
    await router.push(redirectTo.value)
  } catch (error) {
    handleErrorWithToast(t('invitation.decline.error'), error)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (token) {
    await loadInvitation()
  }

  if (!invitation) {
    await router.push('/')
  }

  if (authStore.userData?.email !== invitation?.email) {
    toast.info(t('invitation.invalidEmail'))
    store.clearInvitation()
    await router.push('/')
  }
})
</script>

<template>
  <GuestLayout>
    <div class="container mx-auto max-w-2xl py-8" :class="{ 'opacity-50': loading || submitting }">
      <div class="space-y-6">
        <div class="text-center space-y-2">
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ t('invitation.title') }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ t('invitation.description') }}
          </p>
        </div>

        <div v-if="loading" class="text-center text-muted-foreground">
          {{ t('invitation.loading') }}
        </div>

        <Alert v-else-if="error" variant="destructive">
          <AlertTitle>
            {{ t('common.error') }}
          </AlertTitle>
          <AlertDescription>
            {{ error }}
          </AlertDescription>
        </Alert>

        <template v-else>
          <InvitationInfo />

          <div class="flex gap-4 justify-center">
            <Button
              variant="destructive"
              :disabled="loading || submitting"
              :loading="submitting"
              size="lg"
              @click="handleDecline"
            >
              <X class="w-4 h-4" />
              {{ t('invitation.decline.button') }}
            </Button>
            <Button
              :disabled="loading || submitting"
              :loading="submitting"
              size="lg"
              @click="handleAccept"
            >
              <Check class="w-4 h-4" />
              {{ t('invitation.accept.button') }}
            </Button>
          </div>
        </template>
      </div>
    </div>
  </GuestLayout>
</template>
