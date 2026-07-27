<script setup lang="ts">
import { FileCheck } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useComingSoonAction } from '../../composables/useComingSoonAction'
import type { IInvoice } from '../../types/invoice.type'

const { t } = useI18n()
const { notifyComingSoon } = useComingSoonAction()

const props = defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

const isDisabled = computed(() => !props.invoice && !props.invoices?.length)
const tooltip = computed(() => isDisabled.value
  ? t('invoice.actions.sendToKsef.selectRequired')
  : undefined)
</script>

<template>
  <span v-tooltip="tooltip">
    <Button
      v-if="variant === 'button'"
      variant="outline"
      size="sm"
      :disabled="isDisabled"
      @click="notifyComingSoon"
    >
      <FileCheck class="size-4" />
      {{ t('invoice.actions.sendToKsef.title') }}
    </Button>
    <DropdownMenuItem
      v-else
      hoverable
      :disabled="isDisabled"
      @click="notifyComingSoon"
    >
      <FileCheck class="size-4 mr-2" />
      {{ t('invoice.actions.sendToKsef.title') }}
    </DropdownMenuItem>
  </span>
</template>
