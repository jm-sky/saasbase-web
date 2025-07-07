<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Template syntax examples - using computed to avoid Vue template parsing issues
const templateSyntax = computed(() => ({
  translation1: '{{t \'invoices.invoice\'}}',
  translation2: '{{t \'invoices.from\'}}',
  translation3: '{{t \'invoices.to\'}}',
  translation4: '{{t \'invoices.total\'}}',
  logoCheck: '{{#if invoice.seller.logoUrl}}',
  logoDisplay: '{{{logoUrl invoice.seller.logoUrl width=\'180px\'}}}',
  signature: '{{{signatureUrl signature}}}',
  invoiceNumber: '{{invoice.number}}',
  sellerName: '{{invoice.seller.name}}',
  buyerName: '{{invoice.buyer.name}}',
  totalGross: '{{invoice.formattedTotalGross}}',
  eachLines: '{{#each invoice.lines}}',
  description: '{{description}}',
  totalNet: '{{formattedTotalNet}}',
  vatSummary: '{{#each invoice.vatSummary}}',
  signatureCheck: '{{#if options.includeSignatures}}',
  issuerName: '{{options.issuerSignature.name}}',
  receiverName: '{{options.receiverSignature.name}}'
}))
</script>

<template>
  <div class="advanced-features bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">
      {{ t('invoice.advanced_features') }}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
      <div>
        <h3 class="font-medium text-gray-900 mb-2">
          {{ t('invoice.multilingual') }}
        </h3>
        <div class="space-y-1 text-gray-600">
          <p><code>{{ templateSyntax.translation1 }}</code> - {{ t('invoice.translatable_text') }}</p>
          <p><code>{{ templateSyntax.translation2 }}</code> - {{ t('invoice.from_label') }}</p>
          <p><code>{{ templateSyntax.translation3 }}</code> - {{ t('invoice.to_label') }}</p>
          <p><code>{{ templateSyntax.translation4 }}</code> - {{ t('invoice.total_label') }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-gray-900 mb-2">
          {{ t('invoice.images_media') }}
        </h3>
        <div class="space-y-1 text-gray-600">
          <p><code>{{ templateSyntax.logoCheck }}</code> - {{ t('invoice.check_logo_exists') }}</p>
          <p><code>{{ templateSyntax.logoDisplay }}</code> - {{ t('invoice.display_logo') }}</p>
          <p><code>{{ templateSyntax.signature }}</code> - {{ t('invoice.display_signature') }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-gray-900 mb-2">
          {{ t('invoice.custom_colors') }}
        </h3>
        <div class="space-y-1 text-gray-600">
          <p><code>accent-bg</code> - {{ t('invoice.accent_background') }}</p>
          <p><code>accent-text</code> - {{ t('invoice.accent_text_color') }}</p>
          <p><code>accent-border</code> - {{ t('invoice.accent_border') }}</p>
          <p><code>secondary-text</code> - {{ t('invoice.secondary_text') }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-gray-900 mb-2">
          {{ t('invoice.invoice_structure') }}
        </h3>
        <div class="space-y-1 text-gray-600">
          <p><code>{{ templateSyntax.invoiceNumber }}</code> - {{ t('invoice.invoice_number') }}</p>
          <p><code>{{ templateSyntax.sellerName }}</code> - {{ t('invoice.seller_name') }}</p>
          <p><code>{{ templateSyntax.buyerName }}</code> - {{ t('invoice.buyer_name') }}</p>
          <p><code>{{ templateSyntax.totalGross }}</code> - {{ t('invoice.formatted_total') }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-gray-900 mb-2">
          {{ t('invoice.line_items') }}
        </h3>
        <div class="space-y-1 text-gray-600">
          <p><code>{{ templateSyntax.eachLines }}</code> - {{ t('invoice.loop_line_items') }}</p>
          <p><code>{{ templateSyntax.description }}</code> - {{ t('invoice.item_description') }}</p>
          <p><code>{{ templateSyntax.totalNet }}</code> - {{ t('invoice.formatted_net_total') }}</p>
          <p><code>{{ templateSyntax.vatSummary }}</code> - {{ t('invoice.vat_summary_loop') }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-gray-900 mb-2">
          {{ t('invoice.signatures_section') }}
        </h3>
        <div class="space-y-1 text-gray-600">
          <p><code>{{ templateSyntax.signatureCheck }}</code> - {{ t('invoice.signature_check') }}</p>
          <p><code>{{ templateSyntax.issuerName }}</code> - {{ t('invoice.issuer_name') }}</p>
          <p><code>{{ templateSyntax.receiverName }}</code> - {{ t('invoice.receiver_name') }}</p>
        </div>
      </div>
    </div>

    <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 class="font-medium text-blue-900 mb-2">
        {{ t('invoice.important_notes') }}
      </h4>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• {{ t('invoice.note_calculations') }}</li>
        <li>• {{ t('invoice.note_media_urls') }}</li>
        <li>• {{ t('invoice.note_tenant_isolation') }}</li>
        <li>• {{ t('invoice.note_page_numbering') }}</li>
      </ul>
    </div>
  </div>
</template>
