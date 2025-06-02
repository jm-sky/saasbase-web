<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import { tenantAddressesService } from '@/domains/tenant/services/TenantAddressesService'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'
import type { ISubscriptionPlan, StoreSubscriptionRequest, TBillingInterval } from '../types/subscription.type'
import { subscriptionService } from '../services/SubscriptionService'
import StripeCheckoutForm from './StripeCheckoutForm.vue'

const { t } = useI18n()
const tenantStore = useTenantStore()
const { tenant, tenantId, tenantBillingAddress } = storeToRefs(tenantStore)

const open = defineModel<boolean>('open', { required: true })

const { plan, billingInterval } = defineProps<{
  plan: ISubscriptionPlan
  billingInterval: TBillingInterval
}>()

const loading = ref(false)

const address = computed(() => {
  if (!tenantBillingAddress.value) {
    return 'No billing address found'
  }

  return `${tenantBillingAddress.value.street} ${tenantBillingAddress.value.postalCode} ${tenantBillingAddress.value.city}`
})

const fetchBillingAddress = async () => {
  const response = await tenantAddressesService.index(tenantId.value ?? '')
  tenantBillingAddress.value = response.data.find(address => address.isDefault) ?? response.data[0]
}

const { handleSubmit, setErrors, resetForm } = useForm<StoreSubscriptionRequest>({
  initialValues: {
    planId: plan.id,
    billingInterval,
    paymentDetails: {
      cardNumber: '',
      expiry: '',
      cvc: '',
      name: '',
    },
  },
})

const buySubscription = handleSubmit(async (values) => {
  try {
    loading.value = true
    await subscriptionService.buy(values)
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('common.error'), error)
  } finally {
    loading.value = false
  }
})

watch(open, (value) => {
  if (!value) resetForm()
})

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
    <form class="flex flex-col gap-3" @submit.prevent="buySubscription">
      <div class="flex flex-col gap-2 px-4 py-2 border rounded-md shadow">
        <div class="flex flex-row gap-2 items-center justify-between">
          <div class="text-2xl font-bold">
            {{ plan.name }}
          </div>
          <div class="text-sm text-muted-foreground">
            {{ plan.price }} {{ plan.currency }} / {{ plan.billingInterval }}
          </div>
        </div>
        <div class="text-sm text-muted-foreground">
          {{ plan.description }}
        </div>
      </div>

      <div class="flex flex-col gap-2 px-4 py-2 border rounded-md shadow" :class="{ 'opacity-50': loading }">
        <div class="text-xs font-semibold">
          Billing info
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="text-muted-foreground">
            Name:
          </div>
          <div>
            {{ tenant?.name }}
          </div>
          <div class="text-muted-foreground">
            Address:
          </div>
          <div>
            {{ address }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 px-4 py-2 border rounded-md shadow" :class="{ 'opacity-50': loading }">
        <div class="text-xs font-semibold">
          {{ t('subscription.buy.paymentDetails') }}
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <StripeCheckoutForm :plan />
        </div>
      </div>

      <Button
        class="w-full"
        variant="default"
        type="submit"
        :loading="loading"
        :disabled="loading"
      >
        {{ t('subscription.buy.button') }}
      </Button>
    </form>
  </ModalComponent>
</template>