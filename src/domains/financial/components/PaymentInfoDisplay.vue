<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IInvoicePayment } from '../types/financial.type'

const { t } = useI18n()

defineProps<{
  payment: IInvoicePayment
}>()
</script>

<template>
  <div v-if="payment" class="space-y-6">
    <div class="text-lg font-semibold">
      {{ t('financial.payment.title', 'Payment Information') }}
    </div>

    <div class="space-y-2">
      <div class="text-sm font-medium text-muted-foreground">
        {{ t('financial.payment.fields.notes', 'Notes') }}
      </div>
      <div class="text-sm p-3 bg-muted/50 rounded-md min-h-10">
        {{ payment?.notes ?? '' }}
      </div>
    </div>

    <!-- Bank Account Section -->
    <div v-if="payment?.bankAccount && (payment?.bankAccount?.iban || payment?.bankAccount?.bankName)" class="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div class="font-medium">
        {{ t('financial.payment.fields.bankAccount', 'Bank Account Details') }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-if="payment?.bankAccount?.bankName">
          <div class="text-sm font-medium text-muted-foreground mb-1">
            {{ t('financial.payment.bankAccount.bankName', 'Bank Name') }}
          </div>
          <div class="font-semibold">
            {{ payment?.bankAccount?.bankName }}
          </div>
        </div>

        <div v-if="payment?.bankAccount?.iban">
          <div class="text-sm font-medium text-muted-foreground mb-1">
            {{ t('financial.payment.bankAccount.iban', 'IBAN') }}
          </div>
          <div class="font-semibold font-mono text-sm">
            {{ payment?.bankAccount?.iban }}
          </div>
        </div>

        <div v-if="payment?.bankAccount?.swift">
          <div class="text-sm font-medium text-muted-foreground mb-1">
            {{ t('financial.payment.bankAccount.swift', 'SWIFT Code') }}
          </div>
          <div class="font-semibold font-mono text-sm">
            {{ payment?.bankAccount?.swift }}
          </div>
        </div>
      </div>

      <div v-if="payment?.bankAccount?.country" class="pt-2">
        <div class="text-sm font-medium text-muted-foreground mb-1">
          Country
        </div>
        <div class="font-semibold">
          {{ payment?.bankAccount?.country }}
        </div>
      </div>
    </div>
  </div>
</template>
