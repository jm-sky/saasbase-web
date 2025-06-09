<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Info } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertTitle from '@/components/ui/alert/AlertTitle.vue'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import { accountService, type BillingHistory } from '@/domains/account/services/AccountService'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { money } from '@/lib/money'

const { locale } = useI18n()

const loading = ref(false)
const history = ref<BillingHistory[]>([])

onMounted(async () => {
  await fetchHistory()
})

const fetchHistory = async () => {
  loading.value = true
  try {
    history.value = await accountService.getBillingHistory()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch billing history', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatAmount = (amount: number, currency: string) => {
  return money(amount, currency, locale.value)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'failed':
      return 'text-destructive'
    case 'paid':
      return 'text-success'
    case 'pending':
      return 'text-warning'
    default:
      return 'text-muted-foreground'
  }
}

const downloadInvoice = async (invoiceId: string) => {
  try {
    // TODO: Implement invoice download
    await accountService.delay(1000)
    console.log('Downloading invoice:', invoiceId)
  } catch (error: unknown) {
    handleErrorWithToast('Failed to download invoice', error)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <TenantSectionTitle :title="$t('tenant.billing.history.title')" />
      <Button
        variant="outline"
        :disabled="loading"
        @click="fetchHistory"
      >
        Refresh
      </Button>
    </div>

    <Alert variant="info">
      <AlertTitle class="flex items-center gap-2">
        <Info class="size-4" />
        To jest wersja DEMO
      </AlertTitle>
    </Alert>

    <Card>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium">
                  Date
                </th>
                <th class="text-left py-3 px-4 font-medium">
                  Description
                </th>
                <th class="text-left py-3 px-4 font-medium">
                  Amount
                </th>
                <th class="text-left py-3 px-4 font-medium">
                  Status
                </th>
                <th class="text-right py-3 px-4 font-medium">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in history"
                :key="item.id"
                class="border-b last:border-0"
              >
                <td class="py-3 px-4">
                  {{ formatDate(item.date) }}
                </td>
                <td class="py-3 px-4">
                  <div class="font-medium">
                    {{ item.description }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{ item.planName }}
                  </div>
                </td>
                <td class="py-3 px-4">
                  {{ formatAmount(item.amount, item.currency) }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="inline-flex items-center gap-1"
                    :class="getStatusColor(item.status)"
                  >
                    <Icon
                      :icon="item.status === 'paid' ? 'heroicons:check-circle' : 'heroicons:clock'"
                      class="size-4"
                    />
                    {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <Button
                    v-if="item.invoiceId"
                    variant="ghost"
                    size="sm"
                    :disabled="loading"
                    @click="downloadInvoice(item.invoiceId)"
                  >
                    <Icon
                      icon="heroicons:document-arrow-down"
                      class="size-4 mr-2"
                    />
                    Download
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-if="history.length === 0"
          class="text-center py-12"
        >
          <Icon
            icon="heroicons:document-text"
            class="size-12 text-muted-foreground mx-auto mb-4"
          />
          <h3 class="text-lg font-medium mb-2">
            No billing history
          </h3>
          <p class="text-muted-foreground">
            Your billing history will appear here once you make your first payment.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
