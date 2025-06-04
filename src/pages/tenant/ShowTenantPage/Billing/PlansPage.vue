<script setup lang="ts">
import { Info, RefreshCcw } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertTitle from '@/components/ui/alert/AlertTitle.vue'
import { Button } from '@/components/ui/button'
import Switch from '@/components/ui/switch/Switch.vue'
import BuySubscriptionPlanModal from '@/domains/subscription/components/BuySubscriptionPlanModal.vue'
import PlanCard from '@/domains/subscription/components/PlanCard.vue'
import { subscriptionService } from '@/domains/subscription/services/SubscriptionService'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IBillingPrice, ISubscriptionPlan, ISubscriptionPlanDiscount, TBillingInterval } from '@/domains/subscription/types/subscription.type'

const { t } = useI18n()

const showBuySubscriptionPlanModal = ref(false)
const selectedPlan = ref<ISubscriptionPlan | null>(null)

const discount: ISubscriptionPlanDiscount = {
  amount: 20,
  interval: 'yearly',
}

const loading = ref(false)
const plans = ref<ISubscriptionPlan[]>([])
const selectedInterval = ref<TBillingInterval>('monthly')

const selectedPrice = computed<IBillingPrice | null>(() => {
  if (!selectedPlan.value) return null
  return selectedPlan.value.prices.find(p => p.billingPeriod === selectedInterval.value) ?? null
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

const handlePlanSelect = (plan: ISubscriptionPlan) => {
  selectedPlan.value = plan
  showBuySubscriptionPlanModal.value = true
}

onMounted(async () => {
  await fetchPlans()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <TenantSectionTitle :title="$t('tenant.billing.plans.title')" />

      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          :disabled="loading"
          @click="fetchPlans"
        >
          <RefreshCcw class="size-4" />
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
        :class="selectedInterval === 'monthly' ? 'text-primary' : 'text-muted-foreground'"
        @click="selectedInterval = 'monthly'"
      >
        {{ t('subscription.billingInterval.monthly') }}
      </span>
      <Switch :checked="selectedInterval === 'yearly'" @update:checked="selectedInterval = selectedInterval === 'yearly' ? 'monthly' : 'yearly'" />
      <span class="text-sm font-medium cursor-pointer" :class="selectedInterval === 'yearly' ? 'text-primary' : 'text-muted-foreground'" @click="selectedInterval = 'yearly'">
        {{ t('subscription.billingInterval.yearly') }}
        <span class="ml-1 text-xs text-success">
          {{ t('subscription.plans.save', { amount: discount.amount }) }}
        </span>
      </span>
    </div>

    <!-- Plans Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <PlanCard
        v-for="plan in plans"
        :key="plan.id"
        :plan="plan"
        :price="selectedPrice"
        :selected-interval="selectedInterval"
        :discount
        :loading
        @select="handlePlanSelect"
      />
    </div>

    <BuySubscriptionPlanModal
      v-if="selectedPlan && selectedPrice"
      v-model:open="showBuySubscriptionPlanModal"
      :billing-interval="selectedInterval"
      :plan="selectedPlan"
      :price="selectedPrice"
    />
  </div>
</template>
