<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Info } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertTitle from '@/components/ui/alert/AlertTitle.vue'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import { subscriptionService } from '@/domains/subscription/services/SubscriptionService'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { money } from '@/lib/money'
import type { ISubscriptionPlan } from '@/domains/subscription/types/subscription.type'

const { t } = useI18n()

const discount = {
  amount: 20,
  interval: 'year',
}

const loading = ref(false)
const plans = ref<ISubscriptionPlan[]>([])
const selectedInterval = ref<'month' | 'year'>('month')

onMounted(async () => {
  await fetchPlans()
})

const fetchPlans = async () => {
  loading.value = true
  try {
    plans.value = await subscriptionService.index()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch plans', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (plan: ISubscriptionPlan) => {
  const price = selectedInterval.value === discount.interval ? plan.price * (100 - discount.amount) / 100 : plan.price
  return money(price, plan.currency)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getIntervalLabel = (plan: ISubscriptionPlan) => {
  return selectedInterval.value === 'year' ? t('subscription.plans.yearly') : t('subscription.plans.monthly')
}

const handlePlanSelect = async (plan: ISubscriptionPlan) => {
  if (plan.isCurrent) return

  try {
    // TODO: Implement plan change
    console.log('Changing to plan:', plan.id)
    await fetchPlans()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to change plan', error)
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <TenantSectionTitle :title="$t('tenant.billing.plans.title')" />

      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          :disabled="loading"
          @click="fetchPlans"
        >
          Refresh
        </Button>
      </div>
    </div>

    <Alert variant="info">
      <AlertTitle class="flex items-center gap-2">
        <Info class="size-4" />
        To jest wersja DEMO
      </AlertTitle>
    </Alert>

    <!-- Billing Interval Toggle -->
    <div class="flex items-center justify-center gap-4 py-2 mb-8">
      <span
        class="text-sm font-medium cursor-pointer"
        :class="selectedInterval === 'month' ? 'text-primary' : 'text-muted-foreground'"
        @click="selectedInterval = 'month'"
      >
        {{ t('subscription.plans.monthly') }}
      </span>
      <Switch :checked="selectedInterval === 'year'" @update:checked="selectedInterval = selectedInterval === 'year' ? 'month' : 'year'" />
      <span class="text-sm font-medium cursor-pointer" :class="selectedInterval === 'year' ? 'text-primary' : 'text-muted-foreground'" @click="selectedInterval = 'year'">
        {{ t('subscription.plans.yearly') }}
        <span class="ml-1 text-xs text-success">
          {{ t('subscription.plans.save', { amount: discount.amount }) }}
        </span>
      </span>
    </div>

    <!-- Plans Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card
        v-for="plan in plans"
        :key="plan.id"
        class="card relative shadow-md"
        :class="{ 'border-primary': plan.isCurrent }"
      >
        <CardContent class="p-5 flex flex-col h-full">
          <!-- Plan Header -->
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold">
              {{ plan.name }}
            </h3>
            <p class="text-sm text-muted-foreground mb-4">
              {{ plan.description }}
            </p>
            <div class="text-3xl font-bold">
              {{ formatPrice(plan) }}
              <span class="text-sm font-normal text-muted-foreground">
                {{ getIntervalLabel(plan) }}
              </span>
            </div>
          </div>

          <!-- Features List -->
          <ul class="space-y-3 mb-6">
            <li
              v-for="feature in plan.features"
              :key="feature.id"
              class="grid grid-cols-[1fr_auto] items-center gap-2 text-sm"
            >
              <div class="flex items-center gap-2">
                <Icon
                  icon="heroicons:check"
                  class="size-5 text-success flex-shrink-0"
                />
                <span class="font-medium">
                  {{ t(`subscription.features.type.${feature.name}`) }}
                </span>
              </div>
              <div class="text-muted-foreground text-right px-2">
                <template v-if="feature.type === 'boolean'">
                  {{ feature.value ? 'Yes' : 'No' }}
                </template>
                <template v-else>
                  {{ feature.value }}
                </template>
              </div>
            </li>
          </ul>

          <!-- Action Button -->
          <Button
            class="w-full mt-auto mb-0"
            :variant="plan.isCurrent ? 'outline' : 'default'"
            :disabled="plan.isCurrent || loading"
            @click="handlePlanSelect(plan)"
          >
            {{ plan.isCurrent ? 'Current Plan' : 'Select Plan' }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
