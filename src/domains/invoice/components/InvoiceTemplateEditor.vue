<script setup lang="ts">
import { AlertTriangle, Eye, Save, X } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import { useToast } from '@/components/ui/toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IInvoiceTemplate } from '../types/invoiceTemplate.type'
import { invoiceTemplateService, type ITemplatePreviewOptions } from '../services/InvoiceTemplate.service'
import AdvancedFeaturesReference from './AdvancedFeaturesReference.vue'
import PreviewOptions from './PreviewOptions.vue'
import TemplateHelperReference from './TemplateHelperReference.vue'

const { t } = useI18n()
const { toast } = useToast()

const props = defineProps<{
  template: IInvoiceTemplate | null
  systemTemplates: IInvoiceTemplate[]
  userTemplates: IInvoiceTemplate[]
}>()

const emit = defineEmits<{
  save: [template: IInvoiceTemplate]
  cancel: []
}>()

// Reactive data
const editableTemplate = ref<IInvoiceTemplate>({
  id: '',
  name: '',
  description: '',
  content: '',
  category: 'invoice',
  previewData: {},
  settings: {},
  isActive: true,
  isDefault: false,
  isSystem: false
})

const selectedTemplateId = ref('')
const previewHtml = ref('')
const previewError = ref('')
const isLoading = ref(false)
const showPreviewOptions = ref(false)
const draftTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const previewOptions = ref<ITemplatePreviewOptions>({
  language: 'en',
  currency: 'USD',
  accentColor: '#3B82F6',
  secondaryColor: '#6B7280',
  includeLogo: true,
  includeSignatures: false,
  dateFormat: 'Y-m-d',
  timezone: 'UTC'
})

// Computed properties
const canSave = computed(() => {
  return editableTemplate.value.name.trim() && editableTemplate.value.content.trim()
})

// Methods
const loadTemplate = async () => {
  if (!selectedTemplateId.value) return

  try {
    isLoading.value = true
    const templateData = await invoiceTemplateService.get(selectedTemplateId.value)

    editableTemplate.value = {
      id: templateData.id,
      name: templateData.name,
      description: templateData.description ?? '',
      content: templateData.content,
      category: templateData.category,
      previewData: templateData.previewData ?? {},
      settings: templateData.settings ?? {},
      isActive: templateData.isActive,
      isDefault: templateData.isDefault,
      isSystem: templateData.isSystem
    }
  } catch (error: unknown) {
    handleErrorWithToast(t('errors.failed_to_load_template'), error)
  } finally {
    isLoading.value = false
  }
}

const previewTemplate = async () => {
  if (!editableTemplate.value.content.trim()) {
    toast.error(t('invoices.enter_template_content'))
    return
  }

  try {
    isLoading.value = true
    previewError.value = ''

    const response = await invoiceTemplateService.preview({
      content: editableTemplate.value.content,
      options: previewOptions.value,
      previewData: getSampleData()
    })

    previewHtml.value = response.html
  } catch (error: unknown) {
    handleErrorWithToast(t('errors.preview_failed'), error)
    previewHtml.value = ''
  } finally {
    isLoading.value = false
  }
}

const saveTemplate = async () => {
  if (!canSave.value) return

  try {
    isLoading.value = true

    let savedTemplate: IInvoiceTemplate
    if (editableTemplate.value.id) {
      // Update existing template
      savedTemplate = await invoiceTemplateService.update(editableTemplate.value.id, {
        ...editableTemplate.value,
        previewData: getSampleData()
      })
    } else {
      // Create new template
      savedTemplate = await invoiceTemplateService.create({
        ...editableTemplate.value,
        previewData: getSampleData()
      })
    }

    toast.success(t('invoices.template_saved_successfully'))
    emit('save', savedTemplate)
  } catch (error: unknown) {
    handleErrorWithToast(t('errors.save_failed'), error)
  } finally {
    isLoading.value = false
  }
}

const cancelEditing = () => {
  emit('cancel')
}

const getSampleData = () => {
  return {
    invoice: {
      id: '01HZ123456789',
      number: 'PREVIEW-001',
      type: 'invoice',
      status: 'issued',
      formattedTotalNet: formatCurrency(1000.00, previewOptions.value.currency),
      formattedTotalTax: formatCurrency(230.00, previewOptions.value.currency),
      formattedTotalGross: formatCurrency(1230.00, previewOptions.value.currency),
      currency: previewOptions.value.currency,
      currencySymbol: getCurrencySymbol(previewOptions.value.currency),
      issueDate: '2024-07-06',
      dueDate: '2024-08-05',
      seller: {
        name: 'Example Company Sp. z o.o.',
        address: 'ul. Przykładowa 123, 00-001 Warszawa',
        country: 'Polska',
        taxId: '1234567890',
        email: 'kontakt@example.com',
        logoUrl: previewOptions.value.includeLogo ? '/sample-logo.png' : null
      },
      buyer: {
        name: 'Client Company Ltd.',
        address: '456 Client Street, Warsaw',
        country: 'Poland',
        taxId: '0987654321',
        email: 'client@example.com'
      },
      lines: [
        {
          id: '01HZ123456790',
          description: 'Web Development Services',
          formattedQuantity: '40.00',
          formattedUnitPrice: formatCurrency(20.00, previewOptions.value.currency),
          formattedTotalNet: formatCurrency(800.00, previewOptions.value.currency),
          formattedTotalVat: formatCurrency(184.00, previewOptions.value.currency),
          formattedTotalGross: formatCurrency(984.00, previewOptions.value.currency),
          vatRateName: 'Standard VAT',
          vatRateValue: 23.0
        },
        {
          id: '01HZ123456791',
          description: 'Consulting Services',
          formattedQuantity: '10.00',
          formattedUnitPrice: formatCurrency(20.00, previewOptions.value.currency),
          formattedTotalNet: formatCurrency(200.00, previewOptions.value.currency),
          formattedTotalVat: formatCurrency(46.00, previewOptions.value.currency),
          formattedTotalGross: formatCurrency(246.00, previewOptions.value.currency),
          vatRateName: 'Standard VAT',
          vatRateValue: 23.0
        }
      ],
      vatSummary: [
        {
          vatRateName: 'Standard VAT',
          vatRateValue: 23.0,
          formattedNet: formatCurrency(1000.00, previewOptions.value.currency),
          formattedVat: formatCurrency(230.00, previewOptions.value.currency),
          formattedGross: formatCurrency(1230.00, previewOptions.value.currency)
        }
      ],
      payment: {
        status: 'pending',
        dueDate: '2024-08-05',
        method: 'bank_transfer',
        terms: 'Payment due within 30 days',
        bankAccount: {
          iban: 'PL61109010140000071219812874',
          swift: 'WBKPPLPP',
          bankName: 'Santander Bank Polska'
        }
      }
    },
    options: {
      ...previewOptions.value,
      issuerSignature: previewOptions.value.includeSignatures ? {
        name: 'Jane Smith',
        title: 'Project Manager',
        date: '2024-07-06',
        imageUrl: '/sample-signature.png'
      } : null,
      receiverSignature: previewOptions.value.includeSignatures ? {
        name: 'John Doe',
        title: 'CEO',
        date: null,
        imageUrl: null
      } : null
    }
  }
}

const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    PLN: 'zł',
    USD: '$',
    EUR: '€',
    UAH: '₴',
    RUB: '₽'
  }
  return symbols[currency] || currency
}

const formatCurrency = (amount: number, currency: string) => {
  const symbol = getCurrencySymbol(currency)
  const formatted = amount.toFixed(2)

  return currency === 'USD' ? `${symbol}${formatted}` : `${formatted} ${symbol}`
}

// Auto-save draft functionality
const saveDraft = () => {
  if (!editableTemplate.value.content.trim()) return

  const draftKey = `template_draft_${Date.now()}`
  localStorage.setItem(draftKey, JSON.stringify({
    ...editableTemplate.value,
    savedAt: new Date().toISOString()
  }))

  // Keep only last 5 drafts
  const drafts = Object.keys(localStorage)
    .filter(key => key.startsWith('template_draft_'))
    .sort()

  while (drafts.length > 5) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    localStorage.removeItem(drafts.shift()!)
  }
}

const loadDraft = () => {
  const drafts = Object.keys(localStorage)
    .filter(key => key.startsWith('template_draft_'))
    .sort()
    .reverse()

  if (drafts.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const latestDraft = JSON.parse(localStorage.getItem(drafts[0])!)
    return latestDraft
  }

  return null
}

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'p':
        event.preventDefault()
        void previewTemplate()
        break
      case 's':
        event.preventDefault()
        void saveTemplate()
        break
    }
  }
}

// Watch for changes to auto-save drafts
watch([() => editableTemplate.value.content, () => editableTemplate.value.name], () => {
  if (draftTimeout.value) {
    clearTimeout(draftTimeout.value)
  }

  draftTimeout.value = setTimeout(() => {
    saveDraft()
  }, 2000)
}, { deep: true })

// Watch for preview option changes to auto-update preview
watch(previewOptions, () => {
  if (previewHtml.value) {
    void previewTemplate()
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  // Load template data if provided
  if (props.template) {
    editableTemplate.value = { ...props.template }
  }

  // Load default app settings
  previewOptions.value.language = 'en' // window.AppConfig?.locale || 'en'
  previewOptions.value.timezone = 'UTC' // window.AppConfig?.timezone || 'UTC'

  // Check for unsaved drafts only for new templates
  if (!props.template?.id) {
    const draft = loadDraft()
    if (draft?.content.trim()) {
      const shouldLoad = confirm(t('invoices.load_unsaved_draft'))
      if (shouldLoad) {
        editableTemplate.value = {
          id: '',
          name: draft.name ?? '',
          description: draft.description ?? '',
          content: draft.content,
          category: draft.category ?? 'invoice',
          previewData: draft.previewData ?? {},
          settings: draft.settings ?? {},
          isActive: true,
          isDefault: false,
          isSystem: false
        }
      }
    }
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (draftTimeout.value) {
    clearTimeout(draftTimeout.value)
  }
})
</script>

<template>
  <div class="invoice-template-editor">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ t('invoices.template_editor') }}
          </h1>
          <div class="flex space-x-4">
            <button
              :disabled="isLoading"
              class="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded flex items-center space-x-2"
              @click="previewTemplate"
            >
              <Eye class="w-4 h-4" />
              <span>{{ t('common.preview') }}</span>
            </button>
            <button
              :disabled="isLoading || !canSave"
              class="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded flex items-center space-x-2"
              @click="saveTemplate"
            >
              <Save class="w-4 h-4" />
              <span>{{ t('common.save') }}</span>
            </button>
            <button
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center space-x-2"
              @click="cancelEditing"
            >
              <X class="w-4 h-4" />
              <span>{{ t('common.cancel') }}</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Template Editor Panel -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="space-y-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('invoices.template_name') }}
                </label>
                <input
                  v-model="editableTemplate.name"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="$t('invoices.template_name_placeholder')"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('common.description') }}
                </label>
                <textarea
                  v-model="editableTemplate.description"
                  rows="2"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="$t('invoices.template_description_placeholder')"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('invoices.load_template') }}
                </label>
                <select
                  v-model="selectedTemplateId"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  @change="loadTemplate"
                >
                  <option value="">
                    {{ t('invoices.select_template') }}
                  </option>
                  <optgroup :label="$t('invoices.system_templates')">
                    <option
                      v-for="tmpl in systemTemplates"
                      :key="tmpl.id"
                      :value="tmpl.id"
                    >
                      {{ tmpl.name }}
                    </option>
                  </optgroup>
                  <optgroup v-if="userTemplates.length" :label="$t('invoices.user_templates')">
                    <option
                      v-for="tmpl in userTemplates"
                      :key="tmpl.id"
                      :value="tmpl.id"
                    >
                      {{ tmpl.name }}
                    </option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('invoices.template_content') }}
              </label>
              <div class="border border-gray-300 rounded-md">
                <textarea
                  v-model="editableTemplate.content"
                  class="w-full h-96 font-mono text-sm p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  :placeholder="$t('invoices.template_content_placeholder')"
                />
              </div>
            </div>

            <!-- Helper Functions Reference -->
            <TemplateHelperReference />
          </div>

          <!-- Preview Panel -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="mb-4 flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ t('common.preview') }}
              </h2>
              <div class="flex space-x-2">
                <button
                  class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                  @click="showPreviewOptions = !showPreviewOptions"
                >
                  {{ t('invoices.preview_options') }}
                </button>
              </div>
            </div>

            <!-- Preview Options -->
            <PreviewOptions
              v-if="showPreviewOptions"
              v-model="previewOptions"
              class="mb-4"
            />

            <!-- Preview Content -->
            <div
              class="border border-gray-300 rounded-md p-4 bg-gray-50 overflow-auto"
              style="height: 600px;"
            >
              <!-- eslint-disable-next-line vue/no-v-html vue/html-indent -->
              <div v-if="previewHtml" class="bg-white p-4 shadow-sm preview-content" v-html="previewHtml" />
              <div
                v-else-if="isLoading"
                class="text-center text-gray-500 py-8"
              >
                <LoadingIcon class="mx-auto mb-2" />
                {{ t('common.loading') }}
              </div>
              <div
                v-else
                class="text-center text-gray-500 py-8"
              >
                {{ t('invoices.click_preview') }}
              </div>
            </div>

            <!-- Error Display -->
            <div
              v-if="previewError"
              class="mt-4 bg-red-50 border border-red-200 rounded-md p-4"
            >
              <div class="flex">
                <AlertTriangle class="h-5 w-5 text-red-400 mr-2" />
                <div class="text-sm text-red-700">
                  {{ previewError }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Features Documentation -->
        <AdvancedFeaturesReference class="mt-8" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.invoice-template-editor {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Custom scrollbar for preview */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Code highlighting in helper reference */
code {
  background-color: #f3f4f6;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875em;
}

/* Template editor syntax highlighting */
textarea.font-mono {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  line-height: 1.5;
}

/* Animation for preview loading */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.preview-content {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
