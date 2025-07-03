<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BarChart } from '@/components/ui/chart-bar'
import { balanceWidgetService } from '@/domains/financial/services/balanceWidget.service'
import type { IOverviewWidget } from '@/domains/financial/types/financialWidget.type'

const { t } = useI18n()

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type ChartData = Record<'total' | 'revenue' | 'expenses' | string, number | string> & { name: string }

const data = ref<ChartData[]>([])
const loading = ref(true)
const error = ref(false)

const categories = computed(() => {
  return [
    {
      key: 'total',
      label: t('dashboard.widgets.overview.total', 'Total'),
    },
    {
      key: 'revenue',
      label: t('dashboard.widgets.overview.revenue', 'Revenue'),
    },
    {
      key: 'expenses',
      label: t('dashboard.widgets.overview.expenses', 'Expenses'),
    },
  ]
})

const fetchOverviewData = async () => {
  try {
    loading.value = true
    error.value = false

    const response: IOverviewWidget = await balanceWidgetService.getOverviewChart()

    data.value = response.months.map((item): ChartData => ({
      name: `${item.month} / ${response.year}`,
      total: Math.round(item.balance * 10) / 10,
      revenue: Math.round(item.revenue * 10) / 10,
      expenses: Math.round(item.expenses * 10) / 10,
    }))
  } catch (err) {
    console.error('Failed to fetch overview data:', err)
    error.value = true
    data.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchOverviewData()
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center h-64 text-muted-foreground">
    {{ t('common.loading', 'Loading...') }}
  </div>
  <div v-else-if="error" class="flex items-center justify-center h-64 text-destructive">
    {{ t('common.error', 'Error loading data') }}
  </div>
  <BarChart
    v-else
    :data="data"
    :categories="categories"
    index="name"
    :rounded-corners="4"
  />
</template>
