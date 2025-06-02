<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import { money } from '@/lib/money'
import type { ISubscriptionPlan, ISubscriptionPlanDiscount, TBillingInterval } from '@/domains/subscription/types/subscription.type'

const { t } = useI18n()

const { plan, discount, selectedInterval } = defineProps<{
  plan: ISubscriptionPlan
  selectedInterval: TBillingInterval
  discount: ISubscriptionPlanDiscount
  loading: boolean
}>()

const emit = defineEmits<{
  select: [ISubscriptionPlan]
}>()

const formatPrice = (plan: ISubscriptionPlan) => {
  const price = selectedInterval === plan.billingInterval ? plan.price * (100 - discount.amount) / 100 : plan.price
  return money(price, plan.currency)
}

const intervalLabel = computed(() => t(`subscription.billingInterval.${selectedInterval}`).toLowerCase())
</script>

<template>
  <Card
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
            {{ intervalLabel }}
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
        @click="emit('select', plan)"
      >
        {{ plan.isCurrent ? 'Current Plan' : 'Select Plan' }}
      </Button>
    </CardContent>
  </Card>
</template>