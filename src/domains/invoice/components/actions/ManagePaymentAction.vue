<script setup lang="ts">
import { CreditCard } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useComingSoonAction } from '../../composables/useComingSoonAction'
import type { IInvoice } from '../../types/invoice.type'

const { t } = useI18n()
const { notifyComingSoon } = useComingSoonAction()

defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        v-if="variant === 'button'"
        variant="outline"
        size="sm"
        :disabled="!invoice && !invoices?.length"
      >
        <CreditCard class="size-4" />
        {{ t('invoice.actions.payment.title', 'Manage Payment') }}
      </Button>
      <DropdownMenuItem
        v-else
        hoverable
        :disabled="!invoice && !invoices?.length"
      >
        <CreditCard class="size-4 mr-2" />
        {{ t('invoice.actions.payment.title', 'Manage Payment') }}
      </DropdownMenuItem>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        class="cursor-pointer"
        @click="notifyComingSoon"
      >
        {{ t('invoice.actions.payment.attach', 'Attach Payment') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        class="cursor-pointer"
        @click="notifyComingSoon"
      >
        {{ t('invoice.actions.payment.generate', 'Generate Payment') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
