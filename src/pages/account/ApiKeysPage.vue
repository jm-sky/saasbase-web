<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { accountService, type ApiKey } from '@/domains/account/services/AccountService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const loading = ref(false)
const apiKeys = ref<ApiKey[]>([])

onMounted(async () => {
  await fetchApiKeys()
})

const fetchApiKeys = async () => {
  loading.value = true
  try {
    apiKeys.value = await accountService.getApiKeys()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch API keys', error)
  } finally {
    loading.value = false
  }
}

const createApiKey = async () => {
  try {
    // TODO: Implement API key creation
    await accountService.createApiKey({
      name: 'New API Key',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    })
    await fetchApiKeys()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to create API key', error)
  }
}

const revokeApiKey = async (keyId: string) => {
  try {
    await accountService.revokeApiKey(keyId)
    apiKeys.value = apiKeys.value.filter(key => key.id !== keyId)
  } catch (error: unknown) {
    handleErrorWithToast('Failed to revoke API key', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        API Keys
      </h2>
      <div class="flex gap-2">
        <Button
          variant="outline"
          :disabled="loading"
          @click="fetchApiKeys"
        >
          Refresh
        </Button>
        <Button
          variant="default"
          :disabled="loading"
          @click="createApiKey"
        >
          Create New Key
        </Button>
      </div>
    </div>

    <div class="card">
      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="key in apiKeys"
            :key="key.id"
            class="flex items-start gap-4 p-4 border rounded-lg"
          >
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon
                icon="heroicons:key"
                class="w-5 h-5 text-primary"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-medium">
                  {{ key.name }}
                </h3>
                <span
                  v-if="key.isActive"
                  class="px-2 py-0.5 text-xs rounded-full bg-success/10 text-success"
                >
                  Active
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 text-xs rounded-full bg-destructive/10 text-destructive"
                >
                  Revoked
                </span>
              </div>
              <p class="text-sm text-muted-foreground">
                Created: {{ formatDate(key.createdAt) }}
              </p>
              <p class="text-sm text-muted-foreground">
                Expires: {{ formatDate(key.expiresAt) }}
              </p>
              <p class="text-sm text-muted-foreground">
                Last used: {{ key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never' }}
              </p>
            </div>
            <Button
              v-if="key.isActive"
              variant="destructive"
              size="sm"
              @click="revokeApiKey(key.id)"
            >
              Revoke
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
