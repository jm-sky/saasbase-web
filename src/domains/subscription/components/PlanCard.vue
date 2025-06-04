<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import { config } from '@/config'
import { money } from '@/lib/money'
import type { IBillingPrice, ISubscriptionPlan, ISubscriptionPlanDiscount, TBillingInterval } from '@/domains/subscription/types/subscription.type'

const { t, locale } = useI18n()

const { plan, selectedInterval } = defineProps<{
  plan: ISubscriptionPlan
  selectedInterval: TBillingInterval
  discount: ISubscriptionPlanDiscount
  loading: boolean
}>()

const emit = defineEmits<{
  select: [ISubscriptionPlan]
}>()

const intervalLabel = computed(() => t(`subscription.billingInterval.${selectedInterval}`).toLowerCase())

const price = computed<IBillingPrice | null>(() => {
  return plan.prices.find(p => p.billingPeriod === selectedInterval) ?? null
})

const priceFormatted = computed(() => {
  if (!price.value) return money(0, config.defaults.currency, locale.value)
  return money(price.value.price, price.value.currency, locale.value)
})

const isFree = computed(() => plan.prices.length === 0)
</script>

<template>
  <Card
    class="card relative shadow-md"
    :class="{ 'border-primary': plan.isActive }"
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
          {{ priceFormatted }}
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
        :variant="plan.isActive ? 'outline' : 'default'"
        :disabled="plan.isActive || loading || (!isFree && !price)"
        @click="emit('select', plan)"
      >
        {{ plan.isActive ? 'Current Plan' : 'Select Plan' }}
      </Button>
    </CardContent>
  </Card>
</template>
