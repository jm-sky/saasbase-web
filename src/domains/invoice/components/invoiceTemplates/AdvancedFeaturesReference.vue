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
  <div class="advanced-features bg-background border border-border rounded-lg shadow-lg p-6">
    <h2 class="text-xl font-semibold text-foreground mb-4">
      {{ t('tenant.invoiceTemplates.helper.advancedFeatures') }}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
      <div>
        <h3 class="font-medium text-foreground mb-2">
          {{ t('tenant.invoiceTemplates.helper.multilingual') }}
        </h3>
        <div class="space-y-1 text-muted-foreground">
          <p><code>{{ templateSyntax.translation1 }}</code> - {{ t('tenant.invoiceTemplates.helper.translatableText') }}</p>
          <p><code>{{ templateSyntax.translation2 }}</code> - {{ t('tenant.invoiceTemplates.helper.fromLabel') }}</p>
          <p><code>{{ templateSyntax.translation3 }}</code> - {{ t('tenant.invoiceTemplates.helper.toLabel') }}</p>
          <p><code>{{ templateSyntax.translation4 }}</code> - {{ t('tenant.invoiceTemplates.helper.totalLabel') }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-foreground mb-2">
          {{ t('tenant.invoiceTemplates.helper.imagesMedia') }}
        </h3>
        <div class="space-y-1 text-muted-foreground">
          <p><code>{{ templateSyntax.logoCheck }}</code> - {{ t('tenant.invoiceTemplates.helper.checkLogoExists') }}</p>
          <p><code>{{ templateSyntax.logoDisplay }}</code> - {{ t('tenant.invoiceTemplates.helper.displayLogo') }}</p>
          <p><code>{{ templateSyntax.signature }}</code> - {{ t('tenant.invoiceTemplates.helper.displaySignature') }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-foreground mb-2">
          {{ t('tenant.invoiceTemplates.helper.customColors') }}
        </h3>
        <div class="space-y-1 text-muted-foreground">
          <p><code>accent-bg</code> - {{ t('tenant.invoiceTemplates.helper.accentBackground') }}</p>
          <p><code>accent-text</code> - {{ t('tenant.invoiceTemplates.helper.accentTextColor') }}</p>
          <p><code>accent-border</code> - {{ t('tenant.invoiceTemplates.helper.accentBorder') }}</p>
          <p><code>secondary-text</code> - {{ t('tenant.invoiceTemplates.helper.secondaryText') }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-foreground mb-2">
          {{ t('tenant.invoiceTemplates.helper.invoiceStructure') }}
        </h3>
        <div class="space-y-1 text-muted-foreground">
          <p><code>{{ templateSyntax.invoiceNumber }}</code> - {{ t('financial.fields.number') }}</p>
          <p><code>{{ templateSyntax.sellerName }}</code> - {{ t('financial.fields.seller') }}</p>
          <p><code>{{ templateSyntax.buyerName }}</code> - {{ t('financial.fields.buyer') }}</p>
          <p><code>{{ templateSyntax.totalGross }}</code> - {{ t('financial.fields.totalGross') }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-foreground mb-2">
          {{ t('tenant.invoiceTemplates.helper.lineItems') }}
        </h3>
        <div class="space-y-1 text-muted-foreground">
          <p><code>{{ templateSyntax.eachLines }}</code> - {{ t('tenant.invoiceTemplates.helper.loopLineItems') }}</p>
          <p><code>{{ templateSyntax.description }}</code> - {{ t('tenant.invoiceTemplates.helper.itemDescription') }}</p>
          <p><code>{{ templateSyntax.totalNet }}</code> - {{ t('tenant.invoiceTemplates.helper.formattedNetTotal') }}</p>
          <p><code>{{ templateSyntax.vatSummary }}</code> - {{ t('tenant.invoiceTemplates.helper.vatSummaryLoop') }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-foreground mb-2">
          {{ t('tenant.invoiceTemplates.helper.signaturesSection') }}
        </h3>
        <div class="space-y-1 text-muted-foreground">
          <p><code>{{ templateSyntax.signatureCheck }}</code> - {{ t('tenant.invoiceTemplates.helper.signatureCheck') }}</p>
          <p><code>{{ templateSyntax.issuerName }}</code> - {{ t('tenant.invoiceTemplates.helper.issuerName') }}</p>
          <p><code>{{ templateSyntax.receiverName }}</code> - {{ t('tenant.invoiceTemplates.helper.receiverName') }}</p>
        </div>
      </div>
    </div>

    <div class="mt-6 p-4 bg-info/5 rounded-lg border border-info">
      <h4 class="font-medium text-info mb-2">
        {{ t('tenant.invoiceTemplates.helper.importantNotes') }}
      </h4>
      <ul class="text-sm text-info space-y-1">
        <li>• {{ t('tenant.invoiceTemplates.helper.noteCalculations') }}</li>
        <li>• {{ t('tenant.invoiceTemplates.helper.noteMediaUrls') }}</li>
        <li>• {{ t('tenant.invoiceTemplates.helper.noteTenantIsolation') }}</li>
        <li>• {{ t('tenant.invoiceTemplates.helper.notePageNumbering') }}</li>
      </ul>
    </div>
  </div>
</template>
