<script setup lang="ts">
import { Share } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import type { IInvoice } from '../../types/invoice.type'
import { useComingSoonAction } from '../../composables/useComingSoonAction'

const { t } = useI18n()
const { notifyComingSoon } = useComingSoonAction()

defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

// Backend only supports managing share-token records (POST/GET/DELETE
// invoices/{invoice}/share-tokens), there's no public unauthenticated route
// that actually serves a shared invoice by token yet -- generating a "public
// link" today would produce a URL nothing can open. Real fix needs that
// endpoint built first.
</script>

<template>
  <Button
    v-if="variant === 'button'"
    variant="outline"
    size="sm"
    :disabled="!invoice && !invoices?.length"
    @click="notifyComingSoon"
  >
    <Share class="size-4" />
    {{ t('invoice.actions.shareLink.title', 'Share Link') }}
  </Button>
  <DropdownMenuItem
    v-else
    hoverable
    :disabled="!invoice && !invoices?.length"
    @click="notifyComingSoon"
  >
    <Share class="size-4 mr-2" />
    {{ t('invoice.actions.shareLink.title', 'Share Link') }}
  </DropdownMenuItem>
</template>
