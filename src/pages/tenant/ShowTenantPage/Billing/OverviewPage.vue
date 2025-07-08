<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Info, RefreshCcw } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import ButtonLink from '@/components/ButtonLink.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertTitle from '@/components/ui/alert/AlertTitle.vue'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { type ICurrentSubscriptionQuotas, tenantSubscriptionService } from '@/domains/tenant/services/TenantSubscriptionService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { ISubscriptionPlan } from '@/domains/subscription/types/subscription.type'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const { tenant } = defineProps<{
  tenant?: ITenant
}>()

const loading = ref(false)
const currentPlan = ref<ISubscriptionPlan | null>(null)
const usage = ref<ICurrentSubscriptionQuotas>({
  storage: {
    used: 0,
    total: 500,
    unit: 'MB',
  },
  users: {
    used: 0,
    total: 10,
  },
  apiCalls: {
    used: 0,
    total: 100000,
  },
})

const fetchCurrentPlan = async () => {
  loading.value = true
  try {
    const plan = await tenantSubscriptionService.getCurrentPlan(tenant?.id ?? '')
    currentPlan.value = plan
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch current plan', error)
  } finally {
    loading.value = false
  }
}

const fetchUsage = async () => {
  try {
    const quotas = await tenantSubscriptionService.getQuotas(tenant?.id ?? '')
    usage.value = quotas
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch usage', error)
  } finally {
    loading.value = false
  }
}

const refresh = async () => {
  loading.value = true
  await fetchCurrentPlan()
  await fetchUsage()
  loading.value = false
}

const formatUsage = (used: number, total: number, unit = '') => {
  const percentage = Math.round((used / total) * 100)
  return `${used}${unit} / ${total}${unit} (${percentage}%)`
}

onMounted(async () => {
  await refresh()
})

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <TenantSectionTitle :title="$t('tenant.billing.overview.title')" />
      <Button
        variant="ghost"
        :disabled="loading"
        @click="refresh"
      >
        <RefreshCcw class="size-4" />
      </Button>
    </div>

    <Alert variant="info">
      <AlertTitle class="flex items-center gap-2">
        <Info class="size-4" />
        To jest wersja DEMO
      </AlertTitle>
    </Alert>

    <!-- Current Plan -->
    <Card>
      <CardHeader class="font-semibold">
        Current Plan
      </CardHeader>
      <CardContent class="flex items-center gap-4">
        <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon
            icon="heroicons:credit-card"
            class="size-6 text-primary"
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
          <ButtonLink
            v-if="currentPlan"
            variant="primary"
            :disabled="loading"
            :to="`/tenants/${tenant?.id}/show/billing/plans`"
          >
            Change Plan
          </ButtonLink>
        </div>
      </CardContent>
    </Card>

    <!-- Usage -->
    <Card>
      <CardHeader class="font-semibold">
        Usage
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <!-- Storage -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <Icon
                  icon="heroicons:server"
                  class="size-5 text-muted-foreground"
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
                :class="{ 'bg-red-500': usage.storage.used > usage.storage.total }"
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
                  class="size-5 text-muted-foreground"
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
                :class="{ 'bg-red-500': usage.users.used > usage.users.total }"
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
                  class="size-5 text-muted-foreground"
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
                :class="{ 'bg-red-500': usage.apiCalls.used > usage.apiCalls.total }"
                :style="{ width: `${(usage.apiCalls.used / usage.apiCalls.total) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
