<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import { invoiceShareTokenService, type IPublicSharedInvoice } from '@/domains/invoice/services/invoiceShareTokenService'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { money } from '@/lib/money'

const { t } = useI18n()
const route = useRoute()

const loading = ref(true)
const invoice = ref<IPublicSharedInvoice | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const token = String(route.params.token ?? '')
    invoice.value = await invoiceShareTokenService.getPublicInvoice(token)
  } catch (err) {
    error.value = t('invoice.actions.shareLink.publicLoadError')
    handleErrorWithToast(t('invoice.actions.shareLink.publicLoadError'), err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <GuestLayout>
    <div class="mx-auto max-w-2xl w-full flex flex-col gap-4 px-4 py-8">
      <h1 class="text-2xl font-semibold">
        {{ t('invoice.actions.shareLink.publicTitle') }}
      </h1>

      <div v-if="loading" class="flex justify-center py-12">
        <LoadingIcon />
      </div>

      <Alert v-else-if="error" variant="destructive">
        {{ error }}
      </Alert>

      <div v-else-if="invoice" class="border rounded-md p-4 space-y-3 shadow-sm">
        <div class="flex justify-between gap-4">
          <div>
            <div class="text-sm text-muted-foreground">{{ t('financial.fields.number') }}</div>
            <div class="font-medium">{{ invoice.number }}</div>
          </div>
          <div class="text-right">
            <div class="text-sm text-muted-foreground">{{ t('financial.fields.status') }}</div>
            <div class="font-medium">{{ invoice.status }}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-muted-foreground">{{ t('financial.fields.seller') }}</div>
            <div>{{ (invoice.seller as { name?: string } | null)?.name ?? '—' }}</div>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">{{ t('financial.fields.buyer') }}</div>
            <div>{{ (invoice.buyer as { name?: string } | null)?.name ?? '—' }}</div>
          </div>
        </div>

        <div class="flex justify-between border-t pt-3">
          <span class="text-muted-foreground">{{ t('financial.fields.totalGross') }}</span>
          <span class="font-semibold">{{ money(invoice.totalGross, invoice.currency) }}</span>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
