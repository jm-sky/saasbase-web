<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
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
</script>

<template>
  <Button
    v-if="variant === 'button'"
    variant="outline"
    size="sm"
    :disabled="!invoice && !invoices?.length"
    @click="notifyComingSoon"
  >
    <Bell class="size-4" />
    {{ t('invoice.actions.reminders.title', 'Manage Reminders') }}
  </Button>
  <DropdownMenuItem
    v-else
    hoverable
    :disabled="!invoice && !invoices?.length"
    @click="notifyComingSoon"
  >
    <Bell class="size-4 mr-2" />
    {{ t('invoice.actions.reminders.title', 'Manage Reminders') }}
  </DropdownMenuItem>
</template>
