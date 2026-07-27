<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
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
  ? t('invoice.actions.sendEmail.selectRequired')
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
      <Mail class="size-4" />
      {{ t('invoice.actions.sendEmail.title') }}
    </Button>
    <DropdownMenuItem
      v-else
      hoverable
      :disabled="isDisabled"
      @click="notifyComingSoon"
    >
      <Mail class="size-4 mr-2" />
      {{ t('invoice.actions.sendEmail.title') }}
    </DropdownMenuItem>
  </span>
</template>
