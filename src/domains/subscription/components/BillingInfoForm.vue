<script setup lang="ts">
import { Save, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { FormField } from '@/components/ui/form'
import FormControl from '@/components/ui/form/FormControl.vue'
import FormItem from '@/components/ui/form/FormItem.vue'
import FormLabel from '@/components/ui/form/FormLabel.vue'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import Input from '@/components/ui/input/Input.vue'
import UIIcon from '@/components/UIIcon.vue'
import { tenantBillingCustomerService } from '@/domains/tenant/services/TenantBillingCustomer.service'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { isValidationError } from '@/lib/validation'

const { t } = useI18n()

const tenantStore = useTenantStore()
const { tenant, tenantId, tenantBillingAddress } = storeToRefs(tenantStore)

defineProps<{
  loading: boolean
}>()

const disabled = ref(true)

const address = computed(() => {
  if (!tenantBillingAddress.value) {
    return 'No billing address found'
  }

  return `${tenantBillingAddress.value.street} ${tenantBillingAddress.value.postalCode} ${tenantBillingAddress.value.city}`
})

const { handleSubmit, isSubmitting, setErrors } = useForm({
  initialValues: {
    tenantId: tenantId.value ?? '',
    name: tenant.value?.name ?? '',
    address: address.value,
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await tenantBillingCustomerService.update(values.tenantId, values.name, values.address)
  } catch (error) {
    if (isValidationError(error)) setErrors(error.response.data.errors)
    handleErrorWithToast(t('billing.billingCustomer.update.error'), error)
  }
})
</script>

<template>
  <form class="flex flex-col gap-2 px-4 py-2 border rounded-md shadow" :class="{ 'opacity-50': isSubmitting }" @submit.prevent="onSubmit">
    <div class="flex flex-row gap-2 items-center justify-between text-xs font-semibold">
      <div>
        {{ t('billing.billingCustomer.title') }}
      </div>
      <div class="flex flex-row gap-2 items-center justify-end">
        <Button
          v-if="disabled"
          type="button"
          variant="ghost"
          size="sm"
          @click="disabled = false"
        >
          <UIIcon icon="lucide:pencil" />
        </Button>
        <template v-else>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
          >
            <Save />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="disabled = true"
          >
            <X />
          </Button>
        </template>
      </div>
    </div>
    <div class="flex flex-col gap-2 text-sm">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem class="grid grid-cols-2 gap-2 items-center">
          <FormLabel>
            {{ t('billing.billingCustomer.fields.name') }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" :disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="address">
        <FormItem class="grid grid-cols-2 gap-2 items-center">
          <FormLabel>
            {{ t('billing.billingCustomer.fields.address') }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" :disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </form>
</template>