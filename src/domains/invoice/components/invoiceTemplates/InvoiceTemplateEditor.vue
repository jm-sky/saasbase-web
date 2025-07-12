<script setup lang="ts">
import { AlertTriangle, Eye, Save, X } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { useToast } from '@/components/ui/toast'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { routeMap } from '@/router/routeMap'
import type { IInvoiceTemplate } from '../../types/invoiceTemplate.type'
import { useInvoiceTemplateDraftStorage } from '../../helpers/invoiceTemplateDraftStorage'
import { useGetSampleData } from '../../helpers/invoiceTemplateEditorHelpers'
import { invoiceTemplateService, type ITemplatePreviewOptions } from '../../services/InvoiceTemplate.service'
import AdvancedFeaturesReference from './AdvancedFeaturesReference.vue'
import InvoiceTemplateGroupedPicker from './InvoiceTemplateGroupedPicker.vue'
import MonacoTemplateEditor from './MonacoTemplateEditor.vue'
import PreviewOptions from './PreviewOptions.vue'
import TemplateHelperReference from './TemplateHelperReference.vue'
import type { TUUID } from '@/domains/shared/types/common'

const { t } = useI18n()
const { toast } = useToast()
const router = useRouter()

const props = defineProps<{
  templateId?: TUUID | null
  parentId?: TUUID | null
  tenantId: TUUID
}>()

const emit = defineEmits<{
  save: [template: IInvoiceTemplate]
  cancel: []
}>()

// Reactive data
const draftId = ref('')
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
const previewIframe = ref<HTMLIFrameElement | null>(null)

const previewOptions = ref<ITemplatePreviewOptions>({
  language: undefined,
  currency: undefined,
  accentColor: '#3B82F6',
  secondaryColor: '#6B7280',
  includeLogo: true,
  includeSignatures: false,
  dateFormat: 'Y-m-d',
  timezone: 'UTC'
})

const { getSampleData, getInvoiceSchema } = useGetSampleData(previewOptions)
const { saveDraft, checkForUnsavedDraft, clearDraft } = useInvoiceTemplateDraftStorage(draftId, editableTemplate)

// Computed properties
const canSave = computed(() => {
  return editableTemplate.value.name.trim() && editableTemplate.value.content.trim() && !editableTemplate.value.isSystem
})

// Methods
const loadTemplate = async (templateId: TUUID | undefined | null) => {
  if (!templateId && !props.parentId) return

  try {
    isLoading.value = true
    const templateData = await invoiceTemplateService.get(props.parentId ?? templateId ?? '')

    editableTemplate.value = {
      ...templateData,
      id: props.parentId ? '' : templateData.id,
      name: props.parentId ? `${templateData.name} (Copy)` : templateData.name,
      isSystem: false,
      isDefault: false
    }
  } catch (error: unknown) {
    handleErrorWithToast(t('tenant.invoiceTemplates.editor.loadError'), error)
  } finally {
    isLoading.value = false
  }
}

const previewTemplate = async () => {
  if (!editableTemplate.value.content.trim()) {
    toast.error(t('tenant.invoiceTemplates.editor.enterTemplateContent'))
    return
  }

  try {
    isLoading.value = true
    previewError.value = ''

    const response = await invoiceTemplateService.preview({
      content: editableTemplate.value.content,
      options: previewOptions.value,
      previewData: getSampleData(),
    })

    previewHtml.value = response.html
  } catch (error: unknown) {
    handleErrorWithToast(t('tenant.invoiceTemplates.editor.previewError'), error)
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

    toast.success(t('tenant.invoiceTemplates.editor.saveSuccess'))
    emit('save', savedTemplate)
  } catch (error: unknown) {
    handleErrorWithToast(t('tenant.invoiceTemplates.editor.saveError'), error)
  } finally {
    isLoading.value = false
  }
}

const cancelEditing = () => {
  clearDraft()
  void router.push({ name: routeMap.tenant.financialSettings.invoiceTemplates, params: { id: props.tenantId } })
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

  draftTimeout.value = setTimeout(() => { saveDraft() }, 2000)
}, { deep: true })

// // Watch for preview option changes to auto-update preview
// // Exclude language changes to prevent recursive updates when locale changes globally
// watch(() => ({
//   currency: previewOptions.value.currency,
//   accentColor: previewOptions.value.accentColor,
//   secondaryColor: previewOptions.value.secondaryColor,
//   includeLogo: previewOptions.value.includeLogo,
//   includeSignatures: previewOptions.value.includeSignatures,
//   dateFormat: previewOptions.value.dateFormat,
//   timezone: previewOptions.value.timezone
// }), () => {
//   if (previewHtml.value) {
//     void previewTemplate()
//   }
// }, { deep: true })

// // Watch language separately to avoid recursion
// watch(() => previewOptions.value.language, () => {
//   if (previewHtml.value) {
//     void previewTemplate()
//   }
// })

// Lifecycle
onMounted(async () => {
  draftId.value = `template_draft_${Date.now()}`

  // Load template data if provided
  if (props.templateId || props.parentId) {
    console.log('[onMounted] loadTemplate', props.templateId, props.parentId)
    await loadTemplate(props.templateId)
  }

  // Load default app settings
  previewOptions.value.language = 'en' // window.AppConfig?.locale || 'en'
  previewOptions.value.timezone = 'UTC' // window.AppConfig?.timezone || 'UTC'

  // Check for unsaved drafts only for new templates
  if (!props.templateId && !props.parentId) {
    checkForUnsavedDraft()
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
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <TenantSectionTitle :title="t('tenant.invoiceTemplates.editor.title')">
      <template #actions>
        <Button :disabled="isLoading" variant="primary" @click="previewTemplate">
          <Eye class="size-4" />
          <span>{{ t('tenant.invoiceTemplates.editor.preview') }}</span>
        </Button>
        <Button :disabled="isLoading || !canSave" variant="primary" @click="saveTemplate">
          <Save class="size-4" />
          <span>{{ t('common.save') }}</span>
        </Button>
        <Button variant="secondary" @click="cancelEditing">
          <X class="size-4" />
          <span>{{ t('common.cancel') }}</span>
        </Button>
      </template>
    </TenantSectionTitle>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-2">
      <!-- Template Editor Panel -->
      <div class="bg-background">
        <div class="space-y-4 mb-6">
          <div class="flex gap-4">
            <div class="flex-1">
              <Label class="mb-2">
                {{ t('tenant.invoiceTemplates.fields.name') }}
              </Label>
              <Input v-model="editableTemplate.name" :placeholder="$t('tenant.invoiceTemplates.fields.name')" />
            </div>
            <div>
              <Label class="mb-2">
                {{ t('tenant.invoiceTemplates.editor.loadTemplate') }}
              </Label>
              <InvoiceTemplateGroupedPicker
                v-model="selectedTemplateId"
                @change="loadTemplate(selectedTemplateId)"
              />
            </div>
          </div>

          <div>
            <Label class="mb-2">
              {{ t('tenant.invoiceTemplates.fields.description') }}
            </Label>
            <Textarea
              v-model="editableTemplate.description"
              :placeholder="$t('tenant.invoiceTemplates.fields.description')"
            />
          </div>
        </div>

        <div class="mb-4">
          <Label class="mb-2">
            {{ t('tenant.invoiceTemplates.fields.content') }}
          </Label>
          <MonacoTemplateEditor
            v-model="editableTemplate.content"
            height="400px"
            theme="vs"
            :schema="getInvoiceSchema()"
          />
        </div>

        <!-- Helper Functions Reference -->
        <TemplateHelperReference />
      </div>

      <!-- Preview Panel -->
      <div class="bg-background">
        <div class="mb-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-foreground">
            {{ t('tenant.invoiceTemplates.editor.preview') }}
          </h2>
          <div class="flex space-x-2">
            <Button variant="outline" @click="showPreviewOptions = !showPreviewOptions">
              {{ t('tenant.invoiceTemplates.editor.previewOptions') }}
            </Button>
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
          class="border border-border rounded-md bg-muted overflow-hidden"
          style="height: 600px;"
        >
          <iframe
            v-if="previewHtml"
            ref="previewIframe"
            class="w-full h-full bg-white"
            :srcdoc="previewHtml"
            frameborder="0"
            sandbox="allow-same-origin"
            title="Invoice Template Preview"
          />
          <div
            v-else-if="isLoading"
            class="flex items-center justify-center h-full text-gray-500"
          >
            <div class="text-center">
              <LoadingIcon class="mx-auto mb-2" />
              {{ t('common.loading') }}
            </div>
          </div>
          <div
            v-else
            class="flex items-center justify-center h-full text-gray-500"
          >
            {{ t('tenant.invoiceTemplates.editor.clickPreview') }}
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
</template>

<style scoped>
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

/* Iframe preview styling */
iframe {
  border: none;
  border-radius: 4px;
}
</style>
