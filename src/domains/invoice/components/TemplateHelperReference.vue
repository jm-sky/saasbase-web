<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const openTag = '{{'
const closeTag = '}}'
const openTagDouble = '{{{'
const closeTagDouble = '}}}'
</script>

<template>
  <div class="template-helper-reference bg-gray-50 p-4 rounded-md">
    <h3 class="font-medium text-gray-900 mb-2">
      {{ t('invoice.available_helpers') }}
    </h3>
    <div class="text-sm text-gray-600 space-y-1">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 class="font-medium text-gray-800 mb-1">
            {{ t('invoice.translations') }}
          </h4>
          <p><code>"{{ openTag }} t 'invoices.invoice' {{ closeTag }}"</code> - {{ t('invoice.translatable_text') }}</p>
          <p><code>"{{ openTag }} t 'invoices.from' {{ closeTag }}"</code> - {{ t('invoice.from_label') }}</p>
          <p><code>"{{ openTag }} t 'invoices.total' {{ closeTag }}"</code> - {{ t('invoice.total_label') }}</p>
        </div>

        <div>
          <h4 class="font-medium text-gray-800 mb-1">
            {{ t('invoice.invoice_data') }}
          </h4>
          <p><code>{{ openTag }}invoice.number{{ closeTag }}</code> - {{ t('invoice.invoice_number') }}</p>
          <p><code>{{ openTag }}invoice.seller.name{{ closeTag }}</code> - {{ t('invoice.seller_name') }}</p>
          <p><code>{{ openTag }}invoice.formattedTotalGross{{ closeTag }}</code> - {{ t('invoice.formatted_total') }}</p>
        </div>

        <div>
          <h4 class="font-medium text-gray-800 mb-1">
            {{ t('invoice.conditionals') }}
          </h4>
          <p><code>{{ openTag }}#if invoice.payment{{ closeTag }}</code> - {{ t('invoice.conditional_blocks') }}</p>
          <p><code>{{ openTag }}#each invoice.lines{{ closeTag }}</code> - {{ t('invoice.loop_arrays') }}</p>
        </div>

        <div>
          <h4 class="font-medium text-gray-800 mb-1">
            {{ t('invoice.images') }}
          </h4>
          <p><code>{{ openTagDouble }}logoUrl invoice.seller.logoUrl{{ closeTagDouble }}</code> - {{ t('invoice.display_logo') }}</p>
          <p><code>{{ openTagDouble }}signatureUrl signature{{ closeTagDouble }}</code> - {{ t('invoice.display_signature') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
