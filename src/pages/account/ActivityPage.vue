<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { useAccountStore } from '@/domains/account/stores/account.store'

const store = useAccountStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await store.fetchActivities()
  } catch {
    // Error is already handled by the service
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Activity Log
      </h2>
      <Button
        variant="outline"
        class="metronic-primary-outline"
        :disabled="loading"
        @click="store.fetchActivities"
      >
        <span v-if="loading" class="mr-2 h-4 w-4 animate-spin">⟳</span>
        Refresh
      </Button>
    </div>

    <div class="card">
      <div class="p-6">
        <div v-if="loading && !store.activities.length" class="flex justify-center py-8">
          <span class="h-8 w-8 animate-spin">⟳</span>
        </div>

        <div v-else-if="!store.activities.length" class="text-center py-8 text-muted-foreground">
          No activity found
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="activity in store.activities"
            :key="activity.id"
            class="flex items-start gap-4 pb-6 border-b last:border-0 last:pb-0"
          >
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span class="text-sm text-primary">{{ activity.type[0] }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium">
                {{ activity.description }}
              </p>
              <div class="mt-1 text-sm text-muted-foreground">
                <p>{{ new Date(activity.timestamp).toLocaleString() }}</p>
                <div v-if="activity.ipAddress || activity.device || activity.location" class="mt-1">
                  <p v-if="activity.ipAddress">
                    IP: {{ activity.ipAddress }}
                  </p>
                  <p v-if="activity.device">
                    Device: {{ activity.device }}
                  </p>
                  <p v-if="activity.location">
                    Location: {{ activity.location }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
