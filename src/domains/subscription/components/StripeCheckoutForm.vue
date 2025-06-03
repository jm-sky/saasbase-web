<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { isAxiosError } from 'axios'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { config } from '@/config'
import type { ISubscriptionPlan } from '../types/subscription.type'
import { subscriptionService } from '../services/SubscriptionService'

const { t } = useI18n()

const { plan } = defineProps<{
  plan: ISubscriptionPlan
}>()

const loading = ref(false)
const error = ref('')
const stripePromise = loadStripe(config.stripe.publishableKey)

async function redirectToCheckout() {
  loading.value = true
  error.value = ''

  try {
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe failed to initialize.')
    }

    const response = await subscriptionService.createCheckoutSession({
      planId: plan.id,
      billableType: 'tenant',
      successUrl: `${window.location.origin}/subscription/success`,
      cancelUrl: `${window.location.origin}/subscription/cancel`
    })

    await stripe.redirectToCheckout({ sessionId: response.data.sessionId })

  } catch (err: unknown) {
    error.value = isAxiosError(err) ? err.response?.data.message : 'Unexpected error.'
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <div class="p-4 mx-auto">
    <button
      :disabled="loading"
      class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
      @click="redirectToCheckout"
    >
      {{ loading ? t('subscription.checkout.redirecting') : t('subscription.checkout.button') }}
    </button>
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
