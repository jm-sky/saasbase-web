<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from '@/components/ui/select/Select.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import type { TPaymentStatus } from '@/domains/financial/types/financial.type'

interface StatusOption {
  value: TPaymentStatus
  label: string
  color: string
}

const { t } = useI18n()

const modelValue = defineModel<TPaymentStatus | undefined>('modelValue', { required: true })

const paymentStatuses: StatusOption[] = [
  {
    value: 'pending',
    label: t('financial.payment.status.pending', 'Pending'),
    color: 'bg-yellow-500'
  },
  {
    value: 'paid',
    label: t('financial.payment.status.paid', 'Paid'),
    color: 'bg-green-500'
  },
  {
    value: 'partiallyPaid',
    label: t('financial.payment.status.partiallyPaid', 'partiallyPaid'),
    color: 'bg-gray-500'
  },
  {
    value: 'overdue',
    label: t('financial.payment.status.overdue', 'Overdue'),
    color: 'bg-red-500'
  },
  {
    value: 'cancelled',
    label: t('financial.payment.status.cancelled', 'Cancelled'),
    color: 'bg-gray-500'
  },
]
const currentStatus = computed(() => paymentStatuses.find(s => s.value === modelValue.value))

const currentStatusColor = computed(() => currentStatus.value?.color ?? 'bg-gray-500')

onMounted(() => {
  modelValue.value ??= 'pending'
})
</script>

<template>
  <Select v-model="modelValue">
    <SelectTrigger class="w-40">
      <SelectValue>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" :class="currentStatusColor" />
          <span>{{ currentStatus?.label }}</span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="status in paymentStatuses" :key="status.value" :value="status.value">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" :class="status.color" />
          <span>{{ status.label }}</span>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
