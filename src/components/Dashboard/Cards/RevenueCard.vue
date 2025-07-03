<script setup lang="ts">
import { DollarSignIcon } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { config } from '@/config'
import { invoiceWidgetService } from '@/domains/invoice/services/invoiceWidgetService'
import { money } from '@/lib/money'
import type { IRevenueWidget } from '@/domains/invoice/types/invoiceWidget.type'

const { t, locale } = useI18n()

const data = ref<IRevenueWidget | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchRevenue = async () => {
  try {
    loading.value = true
    error.value = null
    data.value = await invoiceWidgetService.getTotalRevenue()
  } catch (err) {
    error.value = 'Failed to load revenue data'
    console.error('RevenueCard error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchRevenue()
})

const formatPercentage = (percentage: number) => {
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(1)}%`
}
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        {{ t('dashboard.widgets.revenue.title', 'Total Revenue') }}
      </CardTitle>
      <template v-if="loading">
        <LoadingIcon class="size-4 text-muted-foreground" />
      </template>
      <template v-else>
        <DollarSignIcon class="size-4 text-muted-foreground" @click="fetchRevenue" />
      </template>
    </CardHeader>
    <CardContent class="space-y-1">
      <div v-if="loading" class="text-2xl font-bold text-muted-foreground">
        {{ t('common.loading', 'Loading...') }}
      </div>
      <div v-else-if="error" class="text-2xl font-bold text-destructive">
        {{ t('common.error', 'Error') }}
      </div>
      <div v-else class="text-2xl font-bold">
        {{ money(data?.month.current ?? 0, config.defaults.currency, locale) }}
      </div>
      <p v-if="!loading && !error && data" class="text-xs text-muted-foreground">
        {{ formatPercentage(data.month.changePercent) }} from last month
      </p>
    </CardContent>
  </Card>
</template>
