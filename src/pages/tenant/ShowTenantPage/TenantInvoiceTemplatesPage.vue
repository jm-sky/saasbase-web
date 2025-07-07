<script setup lang="ts">
import { Pencil, Plus, Star, Trash, Zap } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import { useToast } from '@/components/ui/toast'
import InvoiceTemplateEditor from '@/domains/invoice/components/InvoiceTemplateEditor.vue'
import { invoiceTemplateService } from '@/domains/invoice/services/InvoiceTemplate.service'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IInvoiceTemplate } from '@/domains/invoice/types/invoiceTemplate.type'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const { t } = useI18n()
const { toast } = useToast()

defineProps<{
  tenant?: ITenant
}>()

// State
const isLoading = ref(false)
const systemTemplates = ref<IInvoiceTemplate[]>([])
const tenantTemplates = ref<IInvoiceTemplate[]>([])
const activeFilter = ref<'all' | 'system' | 'tenant'>('all')
const isEditing = ref(false)
const editingTemplate = ref<IInvoiceTemplate | null>(null)

// Computed
const allTemplates = computed(() => [...systemTemplates.value, ...tenantTemplates.value])

const filteredTemplates = computed(() => {
  switch (activeFilter.value) {
    case 'system':
      return systemTemplates.value
    case 'tenant':
      return tenantTemplates.value
    default:
      return allTemplates.value
  }
})

// Methods
const loadTemplates = async () => {
  try {
    isLoading.value = true

    const [systemTemplatesRes, tenantTemplatesRes] = await Promise.all([
      invoiceTemplateService.getSystemTemplates(),
      invoiceTemplateService.getTenantTemplates()
    ])

    systemTemplates.value = systemTemplatesRes
    tenantTemplates.value = tenantTemplatesRes
  } catch (error) {
    handleErrorWithToast(t('tenant.invoiceTemplates.loadError'), error)
  } finally {
    isLoading.value = false
  }
}

const createNewTemplate = () => {
  editingTemplate.value = {
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
  } as IInvoiceTemplate
  isEditing.value = true
}

const editTemplate = (template: IInvoiceTemplate) => {
  if (template.isSystem) {
    toast.warning(t('tenant.invoiceTemplates.cannotEditSystem'))
    return
  }
  editingTemplate.value = { ...template }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editingTemplate.value = null
}

const onTemplateSaved = async () => {
  try {
    await loadTemplates()
    toast.success(t('tenant.invoiceTemplates.saveSuccess'))
    cancelEditing()
  } catch (error) {
    handleErrorWithToast(t('tenant.invoiceTemplates.saveError'), error)
  }
}

const toggleDefault = async (template: IInvoiceTemplate) => {
  if (template.isDefault || template.isSystem) return

  try {
    await invoiceTemplateService.setDefault(template.id)
    toast.success(t('tenant.invoiceTemplates.defaultSetSuccess'))
    await loadTemplates()
  } catch (error) {
    handleErrorWithToast(t('tenant.invoiceTemplates.defaultSetError'), error)
  }
}

const toggleActive = async (template: IInvoiceTemplate) => {
  if (template.isSystem) return

  try {
    if (template.isActive) {
      await invoiceTemplateService.deactivate(template.id)
      toast.success(t('tenant.invoiceTemplates.deactivateSuccess'))
    } else {
      await invoiceTemplateService.activate(template.id)
      toast.success(t('tenant.invoiceTemplates.activateSuccess'))
    }
    await loadTemplates()
  } catch (error) {
    handleErrorWithToast(t('tenant.invoiceTemplates.toggleActiveError'), error)
  }
}

const deleteTemplate = async (template: IInvoiceTemplate) => {
  if (template.isSystem || template.isDefault) return

  if (!confirm(t('tenant.invoiceTemplates.confirmDelete', { name: template.name }))) {
    return
  }

  try {
    await invoiceTemplateService.delete(template.id)
    toast.success(t('tenant.invoiceTemplates.deleteSuccess'))
    await loadTemplates()
  } catch (error) {
    handleErrorWithToast(t('tenant.invoiceTemplates.deleteError'), error)
  }
}

// Lifecycle
onMounted(() => {
  void loadTemplates()
})
</script>

<template>
  <div class="tenant-invoice-templates-page">
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ $t('tenant.invoiceTemplates.title') }}
        </h2>
        <div class="flex space-x-4">
          <button
            class="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded flex items-center space-x-2"
            @click="createNewTemplate"
          >
            <Plus class="w-4 h-4" />
            <span>{{ $t('tenant.invoiceTemplates.createTemplate') }}</span>
          </button>
        </div>
      </div>

      <!-- Template List -->
      <div v-if="!isEditing" class="bg-white rounded-lg shadow-lg p-6">
        <div class="mb-6">
          <div class="flex space-x-4 mb-4">
            <button
              :class="['px-4 py-2 rounded', activeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
              @click="activeFilter = 'all'"
            >
              {{ $t('tenant.invoiceTemplates.allTemplates') }}
            </button>
            <button
              :class="['px-4 py-2 rounded', activeFilter === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
              @click="activeFilter = 'system'"
            >
              {{ $t('tenant.invoiceTemplates.systemTemplates') }}
            </button>
            <button
              :class="['px-4 py-2 rounded', activeFilter === 'tenant' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
              @click="activeFilter = 'tenant'"
            >
              {{ $t('tenant.invoiceTemplates.tenantTemplates') }}
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-8">
          <LoadingIcon class="mx-auto mb-2" />
          {{ $t('common.loading') }}
        </div>

        <div v-else-if="filteredTemplates.length === 0" class="text-center py-8 text-gray-500">
          {{ $t('tenant.invoiceTemplates.noTemplates') }}
        </div>

        <div v-else class="grid gap-4">
          <div
            v-for="template in filteredTemplates"
            :key="template.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ template.name }}
                  </h3>
                  <span
                    v-if="template.isDefault"
                    class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                  >
                    {{ $t('tenant.invoiceTemplates.default') }}
                  </span>
                  <span
                    v-if="template.isSystem"
                    class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {{ $t('tenant.invoiceTemplates.system') }}
                  </span>
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ template.isActive ? $t('common.active') : $t('common.inactive') }}
                  </span>
                </div>
                <p v-if="template.description" class="text-gray-600 mb-2">
                  {{ template.description }}
                </p>
                <div class="text-sm text-gray-500">
                  {{ $t('tenant.invoiceTemplates.category') }}: {{ template.category }}
                </div>
              </div>
              <div class="flex space-x-2 ml-4">
                <button
                  :disabled="template.isSystem"
                  class="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  @click="editTemplate(template)"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  :disabled="template.isDefault || template.isSystem"
                  class="text-green-600 hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  :title="$t('tenant.invoiceTemplates.setAsDefault')"
                  @click="toggleDefault(template)"
                >
                  <Star class="w-4 h-4" />
                </button>
                <button
                  :disabled="template.isSystem"
                  class="text-yellow-600 hover:text-yellow-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  :title="template.isActive ? $t('common.deactivate') : $t('common.activate')"
                  @click="toggleActive(template)"
                >
                  <Zap class="w-4 h-4" />
                </button>
                <button
                  :disabled="template.isSystem || template.isDefault"
                  class="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  @click="deleteTemplate(template)"
                >
                  <Trash class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Template Editor -->
      <div v-if="isEditing" class="bg-white rounded-lg shadow-lg">
        <InvoiceTemplateEditor
          :template="editingTemplate"
          :system-templates="systemTemplates"
          :user-templates="tenantTemplates"
          @save="onTemplateSaved"
          @cancel="cancelEditing"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tenant-invoice-templates-page {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
