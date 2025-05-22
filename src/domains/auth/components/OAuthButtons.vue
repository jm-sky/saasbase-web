<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import UIIcon from '@/components/UIIcon.vue'
import { config } from '@/config'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { oauthService } from '../services/oauth.service'

const { t } = useI18n()

const handleOAuthLogin = async (provider: 'gitHub' | 'google') => {
  try {
    const url = await oauthService.getOAuthRedirectUrl(provider)
    window.location.href = url
  } catch (error) {
    handleErrorWithToast(t('auth.oauthError'), error)
  }
}
</script>

<template>
  <div class="grid gap-2">
    <Button
      v-if="config.auth.providers.gitHub"
      variant="outline"
      type="button"
      class="w-full transition-all duration-200 hover:shadow-md"
      @click="handleOAuthLogin('gitHub')"
    >
      <UIIcon icon="lucide:github" class="mr-2 size-4" />
      GitHub
    </Button>

    <Button
      v-if="config.auth.providers.google"
      variant="outline"
      type="button"
      class="w-full transition-all duration-200 hover:shadow-md"
      @click="handleOAuthLogin('google')"
    >
      <UIIcon icon="lucide:mail" class="mr-2 size-4" />
      Google
    </Button>
  </div>
</template>
