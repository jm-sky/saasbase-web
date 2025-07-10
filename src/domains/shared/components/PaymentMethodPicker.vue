<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ClearButton from '@/components/Buttons/ClearButton.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { cn } from '@/lib/utils'
import type { IPaymentMethod } from '../types/paymentMethod.type'
import { paymentMethodService } from '../services/PaymentMethod.service'
import { usePaymentMethodStore } from '../stores/paymentMethod.store'

const { t } = useI18n()
const paymentMethodStore = usePaymentMethodStore()
const { paymentMethods } = storeToRefs(paymentMethodStore)

const id = defineModel<string | undefined>('id')
const modelValue = defineModel<IPaymentMethod | undefined>('modelValue', { required: true })

const props = defineProps<{
  class?: string
  popoverContentClass?: string
  disabled?: boolean
  clearable?: boolean
  pickFirst?: boolean
}>()

const open = ref(false)
const loading = ref(false)

const pickFirstValueIfNeeded = () => {
  if (!props.pickFirst) return
  if (paymentMethods.value.length === 0) return
  modelValue.value = paymentMethods.value[0]
}

const loadPaymentMethods = async () => {
  try {
    loading.value = true
    paymentMethods.value = await paymentMethodService.index()
  } catch (err) {
    handleErrorWithToast(t('shared.paymentMethod.loadError'), err)
    console.error('[PaymentMethodPicker][loadPaymentMethods] error:', err)
  } finally {
    loading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelect = (event: any) => {
  const selectedId = event.detail.value
  const selectedPaymentMethod = paymentMethods.value.find((method) => method.id === selectedId)
  id.value = selectedPaymentMethod?.id
  modelValue.value = selectedPaymentMethod
  open.value = false
}

const clear = () => {
  id.value = undefined
  modelValue.value = undefined
}

onMounted(async () => {
  if (paymentMethods.value.length === 0) {
    await loadPaymentMethods()
  }
  pickFirstValueIfNeeded()

})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as="div" class="relative">
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled || loading"
        class="w-full justify-between overflow-hidden truncate"
        :class="props.class"
      >
        {{ modelValue?.name ?? t('shared.paymentMethod.select') }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
      <ClearButton v-if="clearable && modelValue?.id" class="absolute top-0 right-6" @click.stop.capture="clear()" />
    </PopoverTrigger>
    <PopoverContent :class="cn('w-full p-0', popoverContentClass)">
      <Command>
        <CommandInput :placeholder="t('shared.paymentMethod.search')" />
        <CommandList>
          <CommandEmpty>{{ t('shared.paymentMethod.notFound') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="paymentMethod in paymentMethods"
              :key="paymentMethod.id"
              :value="paymentMethod.id"
              @select="onSelect"
            >
              <Check
                class="mr-2 size-4"
                :class="modelValue?.id === paymentMethod.id ? 'opacity-100' : 'opacity-0'"
              />
              {{ t(`financial.payment.method.${paymentMethod.code}`) }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
