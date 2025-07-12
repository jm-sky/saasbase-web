<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import Input from '@/components/ui/input/Input.vue'
import CurrencyPicker from '@/domains/shared/components/CurrencyPicker.vue'
import DateFormatPicker from '@/domains/shared/components/DateFormatPicker.vue'
import type { ITemplatePreviewOptions } from '../../services/InvoiceTemplate.service'
import InvoiceTemplateLanguagePicker from './InvoiceTemplateLanguagePicker.vue'

const { t } = useI18n()

const props = defineProps<{
  modelValue: ITemplatePreviewOptions
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ITemplatePreviewOptions]
}>()

const localOptions = ref<ITemplatePreviewOptions>({ ...props.modelValue })

const colorSchemes = ref([
  { name: 'Blue', accent: '#3B82F6', secondary: '#6B7280' },
  { name: 'Green', accent: '#10B981', secondary: '#6B7280' },
  { name: 'Purple', accent: '#8B5CF6', secondary: '#6B7280' },
  { name: 'Red', accent: '#EF4444', secondary: '#6B7280' },
  { name: 'Orange', accent: '#F97316', secondary: '#6B7280' },
  { name: 'Teal', accent: '#14B8A6', secondary: '#6B7280' },
  { name: 'Gray', accent: '#374151', secondary: '#9CA3AF' }
])

const applyColorScheme = (scheme: { accent: string; secondary: string }) => {
  localOptions.value.accentColor = scheme.accent
  localOptions.value.secondaryColor = scheme.secondary
}

// Track if we're updating from props to prevent circular updates
let isUpdatingFromProps = false

watch(localOptions, (newValue) => {
  if (!isUpdatingFromProps) {
    emit('update:modelValue', { ...newValue })
  }
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  // Prevent circular updates by checking if values are actually different
  const isDifferent = JSON.stringify(localOptions.value) !== JSON.stringify(newValue)
  if (isDifferent) {
    isUpdatingFromProps = true
    localOptions.value = { ...newValue }
    // Reset flag on next tick to allow local changes
    setTimeout(() => {
      isUpdatingFromProps = false
    }, 0)
  }
}, { deep: true })
</script>

<template>
  <div class="preview-options bg-muted/30 p-4 rounded-lg border">
    <h3 class="text-sm font-medium text-foreground mb-3">
      {{ t('tenant.invoiceTemplates.previewOptions.previewOptions') }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label class="block text-xs font-medium text-muted-foreground mb-1">
          {{ t('tenant.invoiceTemplates.previewOptions.language') }}
        </label>
        <InvoiceTemplateLanguagePicker v-model="localOptions.language" />
      </div>

      <div>
        <label class="block text-xs font-medium text-muted-foreground mb-1">
          {{ t('tenant.invoiceTemplates.previewOptions.currency') }}
        </label>
        <CurrencyPicker v-model:id="localOptions.currency" class="w-full" />
      </div>

      <div>
        <label class="block text-xs font-medium text-muted-foreground mb-1">
          {{ t('tenant.invoiceTemplates.previewOptions.dateFormat') }}
        </label>
        <DateFormatPicker v-model="localOptions.dateFormat" />
      </div>
    </div>

    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-medium text-muted-foreground mb-1">
          {{ t('tenant.invoiceTemplates.previewOptions.accentColor') }}
        </label>
        <div class="flex space-x-2">
          <Input
            v-model="localOptions.accentColor"
            type="color"
            class="w-11 p-0.5"
          />
          <Input v-model="localOptions.accentColor" type="text" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-medium text-muted-foreground mb-1">
          {{ t('tenant.invoiceTemplates.previewOptions.secondaryColor') }}
        </label>
        <div class="flex space-x-2">
          <Input
            v-model="localOptions.secondaryColor"
            type="color"
            class="w-11 p-0.5"
          />
          <Input v-model="localOptions.secondaryColor" type="text" />
        </div>
      </div>
    </div>

    <div class="mt-4">
      <h4 class="text-xs font-medium text-muted-foreground mb-2">
        {{ t('tenant.invoiceTemplates.previewOptions.colorSchemes') }}
      </h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="scheme in colorSchemes"
          :key="scheme.name"
          class="flex items-center space-x-2 px-3 py-1 border border-border rounded text-xs hover:bg-muted"
          @click="applyColorScheme(scheme)"
        >
          <div
            class="w-3 h-3 rounded"
            :style="{ backgroundColor: scheme.accent }"
          />
          <span>{{ scheme.name }}</span>
        </button>
      </div>
    </div>

    <div class="mt-4 flex space-x-4">
      <label class="flex items-center text-sm">
        <Checkbox v-model="localOptions.includeLogo" class="mr-2" />
        {{ t('tenant.invoiceTemplates.previewOptions.includeLogo') }}
      </label>

      <label class="flex items-center text-sm">
        <Checkbox v-model="localOptions.includeSignatures" class="mr-2" />
        {{ t('tenant.invoiceTemplates.previewOptions.includeSignatures') }}
      </label>
    </div>
  </div>
</template>
