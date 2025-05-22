<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { accountService, type BillingPlan } from '@/domains/account/services/AccountService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const loading = ref(false)
const currentPlan = ref<BillingPlan | null>(null)
const usage = ref({
  storage: {
    used: 45.2,
    total: 100,
    unit: 'GB',
  },
  users: {
    used: 3,
    total: 5,
  },
  apiCalls: {
    used: 12500,
    total: 50000,
  },
})

onMounted(async () => {
  await fetchCurrentPlan()
})

const fetchCurrentPlan = async () => {
  loading.value = true
  try {
    const plans = await accountService.getBillingPlans()
    currentPlan.value = plans.find(plan => plan.isCurrent) ?? null
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch current plan', error)
  } finally {
    loading.value = false
  }
}

const formatUsage = (used: number, total: number, unit = '') => {
  const percentage = Math.round((used / total) * 100)
  return `${used}${unit} / ${total}${unit} (${percentage}%)`
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Billing Overview
      </h2>
      <Button
        variant="outline"
        :disabled="loading"
        @click="fetchCurrentPlan"
      >
        Refresh
      </Button>
    </div>

    <!-- Current Plan -->
    <div class="card">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">
          Current Plan
        </h3>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon
              icon="heroicons:credit-card"
              class="w-6 h-6 text-primary"
            />
          </div>
          <div>
            <h4 class="font-medium">
              {{ currentPlan?.name || 'No active plan' }}
            </h4>
            <p class="text-sm text-muted-foreground">
              {{ currentPlan?.description || 'Please select a plan to get started' }}
            </p>
          </div>
          <div class="ml-auto">
            <Button
              variant="default"
              :disabled="loading"
              @click="$router.push('/account/billing/plans')"
            >
              Change Plan
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage -->
    <div class="card">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">
          Usage
        </h3>
        <div class="space-y-4">
          <!-- Storage -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <Icon
                  icon="heroicons:server"
                  class="w-5 h-5 text-muted-foreground"
                />
                <span class="font-medium">Storage</span>
              </div>
              <span class="text-sm text-muted-foreground">
                {{ formatUsage(usage.storage.used, usage.storage.total, usage.storage.unit) }}
              </span>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full bg-primary transition-all"
                :style="{ width: `${(usage.storage.used / usage.storage.total) * 100}%` }"
              />
            </div>
          </div>

          <!-- Users -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <Icon
                  icon="heroicons:users"
                  class="w-5 h-5 text-muted-foreground"
                />
                <span class="font-medium">Users</span>
              </div>
              <span class="text-sm text-muted-foreground">
                {{ formatUsage(usage.users.used, usage.users.total) }}
              </span>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full bg-primary transition-all"
                :style="{ width: `${(usage.users.used / usage.users.total) * 100}%` }"
              />
            </div>
          </div>

          <!-- API Calls -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <Icon
                  icon="heroicons:code-bracket"
                  class="w-5 h-5 text-muted-foreground"
                />
                <span class="font-medium">API Calls</span>
              </div>
              <span class="text-sm text-muted-foreground">
                {{ formatUsage(usage.apiCalls.used, usage.apiCalls.total) }}
              </span>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full bg-primary transition-all"
                :style="{ width: `${(usage.apiCalls.used / usage.apiCalls.total) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Method -->
    <div class="card">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">
          Payment Method
        </h3>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Icon
              icon="heroicons:credit-card"
              class="w-6 h-6 text-muted-foreground"
            />
          </div>
          <div>
            <h4 class="font-medium">
              Visa ending in 4242
            </h4>
            <p class="text-sm text-muted-foreground">
              Expires 12/2024
            </p>
          </div>
          <div class="ml-auto">
            <Button
              variant="outline"
              :disabled="loading"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>