<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FormFieldLabeled from '@/components/Form/FormFieldLabeled.vue'
import Input from '@/components/ui/input/Input.vue'
const { t } = useI18n()

defineProps<{
  isSubmitting: boolean
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold mt-2 mb-2 border rounded-md p-4 bg-gray-50">
    <div class="col-span-full text-sm text-muted-foreground mb-4">
      Konto bankowe
    </div>
    <FormFieldLabeled
      v-slot="{ componentField }"
      name="bankAccount.iban"
      :label="t('bankAccounts.fields.iban')"
      :disabled="isSubmitting"
      class="col-span-full"
    >
      <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
    </FormFieldLabeled>
    <FormFieldLabeled
      v-slot="{ componentField }"
      name="bankAccount.swift"
      :label="t('bankAccounts.fields.swift')"
      :disabled="isSubmitting"
    >
      <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
    </FormFieldLabeled>
    <FormFieldLabeled
      v-slot="{ componentField }"
      name="bankAccount.bankName"
      :label="t('bankAccounts.fields.bankName')"
      :disabled="isSubmitting"
    >
      <Input v-bind="componentField" class="bg-white/50 dark:bg-black/50" />
    </FormFieldLabeled>
  </div>
</template>