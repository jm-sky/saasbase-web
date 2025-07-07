<script setup lang="ts">
import { Share } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/toast'
import type { IInvoice } from '../../types/invoice.type'

const { t } = useI18n()
const { toast } = useToast()

defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

const loading = ref(false)

const sharePublicLink = async () => {
  loading.value = true
  try {
    // TODO: Implement service integration
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Copy link to clipboard
    toast.success(t('invoice.actions.shareLink.success', 'Public link copied to clipboard'))
  } catch (error) {
    console.error('Failed to generate public link:', error)
    toast.error(t('invoice.actions.shareLink.error', 'Failed to generate public link'))
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
    :disabled="loading || (!invoice && !invoices?.length)"
    @click="sharePublicLink"
  >
    <Share class="size-4" />
    {{ t('invoice.actions.shareLink.title', 'Share Link') }}
  </Button>
  <DropdownMenuItem
    v-else
    hoverable
    :disabled="loading || (!invoice && !invoices?.length)"
    @click="sharePublicLink"
  >
    <Share class="size-4 mr-2" />
    {{ t('invoice.actions.shareLink.title', 'Share Link') }}
  </DropdownMenuItem>
</template>
