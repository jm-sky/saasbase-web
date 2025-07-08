<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ITemplatePreviewOptions } from '../services/InvoiceTemplate.service'

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

watch(localOptions, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  localOptions.value = { ...newValue }
}, { deep: true })
</script>

<template>
  <div class="preview-options bg-gray-50 p-4 rounded-lg border">
    <h3 class="text-sm font-medium text-gray-900 mb-3">
      {{ t('invoice.preview_options') }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">
          {{ t('invoice.language') }}
        </label>
        <select
          v-model="localOptions.language"
          class="w-full text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="en">
            English
          </option>
          <option value="pl">
            Polski
          </option>
          <option value="uk">
            Українська
          </option>
          <option value="ru">
            Русский
          </option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">
          {{ t('invoice.currency') }}
        </label>
        <select
          v-model="localOptions.currency"
          class="w-full text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="PLN">
            PLN (zł)
          </option>
          <option value="USD">
            USD ($)
          </option>
          <option value="EUR">
            EUR (€)
          </option>
          <option value="UAH">
            UAH (₴)
          </option>
          <option value="RUB">
            RUB (₽)
          </option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">
          {{ t('invoice.date_format') }}
        </label>
        <select
          v-model="localOptions.dateFormat"
          class="w-full text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="Y-m-d">
            2024-07-06
          </option>
          <option value="d/m/Y">
            06/07/2024
          </option>
          <option value="m/d/Y">
            07/06/2024
          </option>
          <option value="d.m.Y">
            06.07.2024
          </option>
          <option value="F j, Y">
            July 6, 2024
          </option>
        </select>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">
          {{ t('invoice.accent_color') }}
        </label>
        <div class="flex space-x-2">
          <input
            v-model="localOptions.accentColor"
            type="color"
            class="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          >
          <input
            v-model="localOptions.accentColor"
            type="text"
            class="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
          >
        </div>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">
          {{ t('invoice.secondary_color') }}
        </label>
        <div class="flex space-x-2">
          <input
            v-model="localOptions.secondaryColor"
            type="color"
            class="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          >
          <input
            v-model="localOptions.secondaryColor"
            type="text"
            class="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
          >
        </div>
      </div>
    </div>

    <div class="mt-4">
      <h4 class="text-xs font-medium text-gray-700 mb-2">
        {{ t('invoice.color_schemes') }}
      </h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="scheme in colorSchemes"
          :key="scheme.name"
          class="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
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
        <input
          v-model="localOptions.includeLogo"
          type="checkbox"
          class="mr-2"
        >
        {{ t('invoice.include_logo') }}
      </label>

      <label class="flex items-center text-sm">
        <input
          v-model="localOptions.includeSignatures"
          type="checkbox"
          class="mr-2"
        >
        {{ t('invoice.include_signatures') }}
      </label>
    </div>
  </div>
</template>
