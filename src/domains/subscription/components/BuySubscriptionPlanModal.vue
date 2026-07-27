<script setup lang="ts">
import { isAxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import UIIcon from '@/components/UIIcon.vue'
import { tenantAddressesService } from '@/domains/tenant/services/TenantAddressesService'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import { subscriptionService } from '../services/SubscriptionService'
import BillingInfoForm from './BillingInfoForm.vue'
import type { IBillingPrice, ISubscriptionPlan, TBillingInterval } from '../types/subscription.type'

const { t } = useI18n()
const tenantStore = useTenantStore()
const { tenantId, tenantBillingAddress } = storeToRefs(tenantStore)

const open = defineModel<boolean>('open', { required: true })

const { plan, price, billingInterval } = defineProps<{
  plan: ISubscriptionPlan
  price: IBillingPrice
  billingInterval: TBillingInterval
}>()

const loading = ref(false)
const error = ref('')
const isDev = import.meta.env.DEV

const fetchBillingAddress = async () => {
  const response = await tenantAddressesService.index(tenantId.value ?? '')
  tenantBillingAddress.value = response.data.find(address => address.isDefault) ?? response.data[0]
}

async function redirectToCheckout() {
  loading.value = true
  error.value = ''

  try {
    const encodedSourcePath = encodeURIComponent(window.location.pathname)
    const response = await subscriptionService.createCheckoutSession({
      planId: plan.id,
      priceId: price.id,
      billableType: 'tenant',
      successUrl: `${window.location.origin}/billing/checkout/success?source_path=${encodedSourcePath}`,
      cancelUrl: `${window.location.origin}/billing/checkout/cancel?source_path=${encodedSourcePath}`,
    })

    window.location.href = response.data.checkoutUrl

  } catch (err: unknown) {
    error.value = isAxiosError(err) ? err.response?.data.message : 'Unexpected error.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchBillingAddress()
})
</script>

<template>
  <ModalComponent
    size="lg"
    :title="t('subscription.buy.title')"
    :description="t('subscription.buy.description')"
    :open="open"
    @update:open="open = $event"
  >
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-2 px-4 py-2 border rounded-md shadow">
        <div class="flex flex-row gap-2 items-center justify-between">
          <div class="text-2xl font-bold">
            {{ plan.name }}
          </div>
          <div class="text-sm text-muted-foreground">
            {{ price.price }} {{ price.currency }} / {{ billingInterval }}
          </div>
        </div>
        <div class="text-sm text-muted-foreground">
          {{ plan.description }}
        </div>
      </div>

      <BillingInfoForm :loading />

      <div class="p-4 mx-auto">
        <Button
          :disabled="loading"
          variant="default"
          class="w-full"
          @click="redirectToCheckout"
        >
          {{ loading ? t('subscription.checkout.redirecting') : t('subscription.checkout.button') }}
        </Button>
        <div v-if="error" class="mt-2 text-sm text-destructive whitespace-nowrap">
          <UIIcon icon="lucide:alert-circle" />
          {{ error }}
        </div>
      </div>

      <div
        v-if="isDev"
        class="flex flex-col gap-1 bg-muted/30 text-muted-foreground text-sm border rounded-md p-2 shadow"
      >
        <div class="font-semibold">
          {{ t('subscription.checkout.testCardTitle') }}
        </div>
        <pre>4242424242424242  05/33  123</pre>
        <div class="text-xs">
          {{ t('subscription.checkout.testCardMore') }}
          <a
            href="https://docs.stripe.com/testing#cards"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline"
          >
            https://docs.stripe.com/testing#cards
          </a>
        </div>
      </div>
    </div>
  </ModalComponent>
</template>
