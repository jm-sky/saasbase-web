<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import InvitationInfo from '@/components/invitation/InvitationInfo.vue'
import Button from '@/components/ui/button/Button.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { useInvitation } from '@/domains/tenant/composables/useTenantInvitation'
import { useNextRedirect } from '@/lib/useNextRedirect'

const { t } = useI18n()
const router = useRouter()
const { toast } = useToast()
const { redirectTo } = useNextRedirect()

const { token, loading, error, loadInvitation, acceptInvitation, declineInvitation } = useInvitation()

const handleAccept = async () => {
  const result = await acceptInvitation()
  if (result) {
    toast({
      title: t('invitation.accept.success'),
      description: t('invitation.accept.successDescription'),
    })
    await router.push(redirectTo.value)
  }
}

const handleDecline = async () => {
  await declineInvitation()
  toast({
    title: t('invitation.decline.success'),
    description: t('invitation.decline.successDescription'),
  })
  await router.push(redirectTo.value)
}

onMounted(() => {
  if (token) {
    void loadInvitation()
  } else {
    void router.push('/')
  }
})
</script>

<template>
  <div class="container mx-auto max-w-2xl py-8">
    <div class="space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ t('invitation.page.title') }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ t('invitation.page.description') }}
        </p>
      </div>

      <div v-if="loading" class="text-center text-muted-foreground">
        {{ t('invitation.page.loading') }}
      </div>

      <div v-else-if="error" class="rounded-lg border p-4 bg-destructive/10">
        <div class="text-sm font-medium text-destructive">
          {{ error }}
        </div>
      </div>

      <template v-else>
        <InvitationInfo />

        <div class="flex justify-center space-x-4">
          <Button
            variant="outline"
            :disabled="loading"
            @click="handleDecline"
          >
            {{ t('invitation.decline.button') }}
          </Button>
          <Button
            :disabled="loading"
            @click="handleAccept"
          >
            {{ t('invitation.accept.button') }}
          </Button>
        </div>
      </template>
    </div>
  </div>
</template>
