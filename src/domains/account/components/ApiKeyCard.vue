<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/badge/Badge.vue'
import { Button } from '@/components/ui/button'
import { apiKeysService, type IApiKey } from '@/domains/account/services/ApiKeys.service'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateString } from '@/lib/toDateString'

const { t } = useI18n()

defineProps<{
  apiKey: IApiKey
}>()

const emit = defineEmits<{
  revoke: [keyId: string]
}>()

const isRevoking = ref(false)

const revokeApiKey = async (keyId: string) => {
  try {
    isRevoking.value = true
    await apiKeysService.revokeApiKey(keyId)
    emit('revoke', keyId)
  } catch (error: unknown) {
    handleErrorWithToast('Failed to revoke API key', error)
  } finally {
    isRevoking.value = false
  }
}
</script>

<template>
  <div class="flex items-start gap-4 p-4 border rounded-lg" :class="{ 'opacity-50 blur-xs': isRevoking }">
    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Icon
        icon="heroicons:key"
        class="size-5 text-primary"
      />
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-medium">
          {{ apiKey.name }}
        </h3>
        <span v-if="apiKey.isActive" class="px-2 py-0.5 text-xs rounded-full bg-success/10 text-success">
          Active
        </span>
        <span v-else class="px-2 py-0.5 text-xs rounded-full bg-destructive/10 text-destructive">
          Revoked
        </span>
      </div>

      <div class="flex gap-2 my-2">
        <Badge
          v-for="scope in apiKey.scopes"
          :key="scope"
          variant="outline"
          class="text-xs text-muted-foreground"
        >
          {{ t(`apiKeys.scopes.${scope}`) }}
        </Badge>
      </div>

      <p class="text-sm text-muted-foreground">
        Created: {{ toDateString(apiKey.createdAt) }}
      </p>
      <p class="text-sm text-muted-foreground">
        Expires: {{ apiKey.expiresAt ? toDateString(apiKey.expiresAt) : 'Never' }}
      </p>
      <p class="text-sm text-muted-foreground">
        Last used: {{ apiKey.lastUsedAt ? toDateString(apiKey.lastUsedAt) : 'Never' }}
      </p>
    </div>
    <Button
      v-if="apiKey.isActive"
      variant="destructive"
      size="sm"
      :disabled="isRevoking"
      :loading="isRevoking"
      @click="revokeApiKey(apiKey.id)"
    >
      Revoke
    </Button>
  </div>
</template>
