<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const openTag = '{{'
const closeTag = '}}'
const openTagDouble = '{{{'
const closeTagDouble = '}}}'
</script>

<template>
  <div class="template-helper-reference bg-muted/30 p-4 rounded-md">
    <h3 class="font-medium text-foreground mb-2">
      {{ t('tenant.invoiceTemplates.helper.availableHelpers') }}
    </h3>
    <div class="text-sm text-muted-foreground space-y-1">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 class="font-medium text-foreground mb-1">
            {{ t('tenant.invoiceTemplates.helper.translations') }}
          </h4>
          <p><code>"{{ openTag }} t 'invoices.invoice' {{ closeTag }}"</code> - {{ t('tenant.invoiceTemplates.helper.translatableText') }}</p>
          <p><code>"{{ openTag }} t 'invoices.from' {{ closeTag }}"</code> - {{ t('tenant.invoiceTemplates.helper.fromLabel') }}</p>
          <p><code>"{{ openTag }} t 'invoices.total' {{ closeTag }}"</code> - {{ t('tenant.invoiceTemplates.helper.totalLabel') }}</p>
        </div>

        <div>
          <h4 class="font-medium text-foreground mb-1">
            {{ t('tenant.invoiceTemplates.helper.invoiceData') }}
          </h4>
          <p><code>{{ openTag }}invoice.number{{ closeTag }}</code> - {{ t('financial.fields.number') }}</p>
          <p><code>{{ openTag }}invoice.seller.name{{ closeTag }}</code> - {{ t('financial.fields.seller') }}</p>
          <p><code>{{ openTag }}invoice.formattedTotalGross{{ closeTag }}</code> - {{ t('financial.fields.totalGross') }}</p>
        </div>

        <div>
          <h4 class="font-medium text-foreground mb-1">
            {{ t('tenant.invoiceTemplates.helper.conditionals') }}
          </h4>
          <p><code>{{ openTag }}#if invoice.payment{{ closeTag }}</code> - {{ t('tenant.invoiceTemplates.helper.conditionalBlocks') }}</p>
          <p><code>{{ openTag }}#each invoice.lines{{ closeTag }}</code> - {{ t('tenant.invoiceTemplates.helper.loopArrays') }}</p>
        </div>

        <div>
          <h4 class="font-medium text-foreground mb-1">
            {{ t('tenant.invoiceTemplates.helper.images') }}
          </h4>
          <p><code>{{ openTagDouble }}logoUrl invoice.seller.logoUrl{{ closeTagDouble }}</code> - {{ t('tenant.invoiceTemplates.helper.displayLogo') }}</p>
          <p><code>{{ openTagDouble }}signatureUrl signature{{ closeTagDouble }}</code> - {{ t('tenant.invoiceTemplates.helper.displaySignature') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
