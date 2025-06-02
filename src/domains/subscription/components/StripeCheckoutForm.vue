<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { isAxiosError } from 'axios'
import { ref } from 'vue'
import { config } from '@/config'
import type { ISubscriptionPlan } from '../types/subscription.type'
import { subscriptionService } from '../services/SubscriptionService'

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
  <div class="p-4 max-w-md mx-auto bg-white rounded shadow">
    <button
      :disabled="loading"
      class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      @click="redirectToCheckout"
    >
      {{ loading ? 'Redirecting...' : 'Checkout' }}
    </button>
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
