<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import ChangeStatusAction from './actions/ChangeStatusAction.vue'
import DeleteInvoiceAction from './actions/DeleteInvoiceAction.vue'
import GeneratePdfAction from './actions/GeneratePdfAction.vue'
import SendEmailAction from './actions/SendEmailAction.vue'
import SendToKsefAction from './actions/SendToKsefAction.vue'
import type { IInvoice } from '../types/invoice.type'

const { t } = useI18n()

const props = defineProps<{
  selectedInvoices?: IInvoice[]
}>()

const selectedCount = computed(() => props.selectedInvoices?.length ?? 0)
const hasSelection = computed(() => selectedCount.value > 0)

const emit = defineEmits<{
  clearSelection: []
  refresh: []
}>()
</script>

<template>
  <div v-if="hasSelection" class="bg-primary/5 border border-primary/20 rounded-md p-4">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="text-sm font-medium text-primary">
          {{ t('invoice.batchActions.selected', 'Selected') }}: {{ selectedCount }}
        </div>
        <Button
          variant="outline"
          size="sm"
          @click="emit('clearSelection')"
        >
          <X class="size-4" />
          {{ t('invoice.batchActions.clearSelection', 'Clear selection') }}
        </Button>
      </div>

      <div class="flex items-center gap-2">
        <ChangeStatusAction
          :invoices="selectedInvoices"
          variant="button"
        />

        <SendEmailAction
          :invoices="selectedInvoices"
          variant="button"
        />

        <SendToKsefAction
          :invoices="selectedInvoices"
          variant="button"
        />

        <GeneratePdfAction
          :invoices="selectedInvoices"
          variant="button"
        />

        <Separator orientation="vertical" class="h-6" />

        <DeleteInvoiceAction
          :invoices="selectedInvoices"
          variant="button"
          @deleted-batch="emit('refresh')"
        />
      </div>
    </div>
  </div>
</template>
