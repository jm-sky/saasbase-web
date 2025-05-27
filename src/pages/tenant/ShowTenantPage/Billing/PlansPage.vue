<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { accountService, type BillingPlan } from '@/domains/account/services/AccountService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const loading = ref(false)
const plans = ref<BillingPlan[]>([])
const selectedInterval = ref<'month' | 'year'>('month')

onMounted(async () => {
  await fetchPlans()
})

const fetchPlans = async () => {
  loading.value = true
  try {
    plans.value = await accountService.getBillingPlans()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch plans', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (plan: BillingPlan) => {
  const price = selectedInterval.value === 'year' ? plan.price * 10 : plan.price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: plan.currency,
  }).format(price)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getIntervalLabel = (plan: BillingPlan) => {
  return selectedInterval.value === 'year' ? 'per year' : 'per month'
}

const handlePlanSelect = async (plan: BillingPlan) => {
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
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Choose Your Plan
      </h2>
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

    <!-- Billing Interval Toggle -->
    <div class="flex items-center justify-center gap-4">
      <span
        :class="[
          'text-sm font-medium cursor-pointer',
          selectedInterval === 'month' ? 'text-primary' : 'text-muted-foreground',
        ]"
        @click="selectedInterval = 'month'"
      >
        Monthly
      </span>
      <Button
        variant="outline"
        size="sm"
        class="relative"
        @click="selectedInterval = selectedInterval === 'month' ? 'year' : 'month'"
      >
        <span class="sr-only">Toggle billing interval</span>
        <div
          class="absolute left-1 top-1 h-4 w-4 rounded-full bg-primary transition-transform"
          :class="selectedInterval === 'year' ? 'translate-x-4' : ''"
        />
      </Button>
      <span
        :class="[
          'text-sm font-medium cursor-pointer',
          selectedInterval === 'year' ? 'text-primary' : 'text-muted-foreground',
        ]"
        @click="selectedInterval = 'year'"
      >
        Yearly
        <span class="ml-1 text-xs text-success">Save 20%</span>
      </span>
    </div>

    <!-- Plans Grid -->
    <div class="grid gap-6 md:grid-cols-3">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="card relative"
        :class="{ 'border-primary': plan.isCurrent }"
      >
        <div class="p-6">
          <!-- Popular Badge -->
          <div
            v-if="plan.isPopular"
            class="absolute -top-3 left-1/2 -translate-x-1/2"
          >
            <span class="px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
              Most Popular
            </span>
          </div>

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
              :key="feature"
              class="flex items-center gap-2 text-sm"
            >
              <Icon
                icon="heroicons:check"
                class="w-5 h-5 text-success flex-shrink-0"
              />
              {{ feature }}
            </li>
          </ul>

          <!-- Action Button -->
          <Button
            class="w-full"
            :variant="plan.isCurrent ? 'outline' : 'default'"
            :disabled="plan.isCurrent || loading"
            @click="handlePlanSelect(plan)"
          >
            {{ plan.isCurrent ? 'Current Plan' : 'Select Plan' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
