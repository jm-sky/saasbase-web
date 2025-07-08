<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NoItems from '@/components/DataLists/NoItems.vue'
import { Button } from '@/components/ui/button'
import Separator from '@/components/ui/separator/Separator.vue'
import AddApiKeyModal from '@/domains/account/components/AddApiKeyModal.vue'
import ApiKeyCard from '@/domains/account/components/ApiKeyCard.vue'
import { apiKeysService, type IApiKey } from '@/domains/account/services/ApiKeys.service'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import SettingsHeader from '../partials/SettingsHeader.vue'
import type { IResourceMeta } from '@/domains/shared/types/resource.type'

const loading = ref(false)
const addApiKeyModalOpen = ref(false)
const apiKeys = ref<IApiKey[]>([])
const meta = ref<IResourceMeta>({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0,
})

onMounted(async () => {
  await fetchApiKeys()
})

const fetchApiKeys = async () => {
  try {
    loading.value = true
    const response = await apiKeysService.getApiKeys()
    apiKeys.value = response.data
    meta.value = response.meta
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch API keys', error)
  } finally {
    loading.value = false
  }
}

const revokeApiKey = (keyId: string) => {
  apiKeys.value = apiKeys.value.map(key => key.id === keyId ? { ...key, isActive: false } : key)
}
</script>

<template>
  <SettingsHeader
    title="API Keys"
    description="Manage your API keys."
    :loading
    refresh
    @refresh="fetchApiKeys"
  >
    <template #right>
      <Button
        variant="default"
        :disabled="loading"
        @click="addApiKeyModalOpen = true"
      >
        Create New Key
      </Button>
    </template>
  </SettingsHeader>

  <Separator />

  <div class="card">
    <div class="p-6">
      <div class="space-y-4">
        <NoItems v-if="apiKeys.length === 0" />
        <ApiKeyCard
          v-for="apiKey in apiKeys"
          :key="apiKey.id"
          :api-key
          @revoke="revokeApiKey"
        />
      </div>
    </div>
  </div>
  <AddApiKeyModal
    :open="addApiKeyModalOpen"
    @update:open="addApiKeyModalOpen = $event"
    @create="[apiKeys.push($event), fetchApiKeys]"
  />
</template>
