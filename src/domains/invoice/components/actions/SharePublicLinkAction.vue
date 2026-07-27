<script setup lang="ts">
import { Share } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'
import { invoiceShareTokenService } from '../../services/invoiceShareTokenService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IInvoice } from '../../types/invoice.type'

const { t } = useI18n()
const loading = ref(false)

const { invoice, invoices, variant = 'menu-item' } = defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

const targetInvoice = () => invoice ?? invoices?.[0]

const sharePublicLink = async () => {
  const current = targetInvoice()
  if (!current?.id) return

  try {
    loading.value = true
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const shareToken = await invoiceShareTokenService.create(current.id, {
      expiresAt: expiresAt.toISOString(),
      onlyForAuthenticated: false,
      maxUsage: 100,
    })

    const publicUrl = `${window.location.origin}/shared/invoices/${shareToken.token}`
    await navigator.clipboard.writeText(publicUrl)
    toast.success(t('invoice.actions.shareLink.success'))
  } catch (error) {
    handleErrorWithToast(t('invoice.actions.shareLink.error'), error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Button
    v-if="variant === 'button'"
    variant="outline"
    size="sm"
    :disabled="loading || !targetInvoice()"
    :loading="loading"
    @click="sharePublicLink"
  >
    <Share class="size-4" />
    {{ t('invoice.actions.shareLink.title') }}
  </Button>
  <DropdownMenuItem
    v-else
    hoverable
    :disabled="loading || !targetInvoice()"
    @click="sharePublicLink"
  >
    <Share class="size-4 mr-2" />
    {{ t('invoice.actions.shareLink.title') }}
  </DropdownMenuItem>
</template>
