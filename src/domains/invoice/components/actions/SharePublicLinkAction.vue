<script setup lang="ts">
import { Share } from 'lucide-vue-next'
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

// The backend can now create a real share token (fixed in the Faza 3
// backend review — POST invoices/{invoice}/share-tokens works), but there
// is still no public, unauthenticated endpoint that redeems one, so a
// "copied to clipboard" link would point nowhere. Not wiring this up until
// that redemption endpoint exists — claiming a working public link right
// now would be just as misleading as the previous fake-success behavior.
const sharePublicLink = () => {
  toast.info(t('invoice.actions.notImplemented'))
}
</script>

<template>
  <Button
    v-if="variant === 'button'"
    variant="outline"
    size="sm"
    :disabled="!invoice && !invoices?.length"
    @click="sharePublicLink"
  >
    <Share class="size-4" />
    {{ t('invoice.actions.shareLink.title', 'Share Link') }}
  </Button>
  <DropdownMenuItem
    v-else
    hoverable
    :disabled="!invoice && !invoices?.length"
    @click="sharePublicLink"
  >
    <Share class="size-4 mr-2" />
    {{ t('invoice.actions.shareLink.title', 'Share Link') }}
  </DropdownMenuItem>
</template>
