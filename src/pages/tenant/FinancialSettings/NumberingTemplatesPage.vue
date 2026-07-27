<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import RefreshIconButton from '@/components/Buttons/RefreshIconButton.vue'
import { Button } from '@/components/ui/button'
import Separator from '@/components/ui/separator/Separator.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/toast'
import NumberingTemplateCard from '@/domains/invoice/components/numberingTemplates/NumberingTemplateCard.vue'
import NumberingTemplateDeleteModal from '@/domains/invoice/components/numberingTemplates/NumberingTemplateDeleteModal.vue'
import NumberingTemplateFormModal from '@/domains/invoice/components/numberingTemplates/NumberingTemplateFormModal.vue'
import {
  useDeleteNumberingTemplate,
  useSetDefaultNumberingTemplate,
} from '@/domains/invoice/composables/useNumberingTemplateMutations'
import { useNumberingTemplateList } from '@/domains/invoice/composables/useNumberingTemplateQueries'
import { getInvoiceTypeLabel, groupTemplatesByInvoiceType } from '@/domains/invoice/utils/numberingTemplateUtils'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { TInvoiceType } from '@/domains/financial/types/financial.type'
import type { IInvoiceNumberingTemplate } from '@/domains/invoice/types/numberingTemplate.type'

const { t } = useI18n()

const showTemplateModal = ref(false)
const selectedTemplate = ref<IInvoiceNumberingTemplate | null>(null)
const selectedInvoiceType = ref<TInvoiceType | null>(null)
const deleteConfirmId = ref<string | null>(null)

const { data: response, isPending: loading, isError, refetch } = useNumberingTemplateList()
const { mutateAsync: setDefaultTemplate } = useSetDefaultNumberingTemplate()
const { mutateAsync: deleteTemplate, isPending: isDeleting } = useDeleteNumberingTemplate()

const numberingTemplates = computed(() => response.value?.data ?? [])
const error = computed(() => isError.value ? t('invoice.numberingTemplate.states.error') : null)

const groupedTemplates = computed(() => groupTemplatesByInvoiceType(numberingTemplates.value))

const handleAddTemplate = (invoiceType: TInvoiceType) => {
  selectedTemplate.value = null
  selectedInvoiceType.value = invoiceType
  showTemplateModal.value = true
}

const handleEditTemplate = (template: IInvoiceNumberingTemplate) => {
  selectedTemplate.value = template
  selectedInvoiceType.value = null
  showTemplateModal.value = true
}

const handleSetDefault = async (template: IInvoiceNumberingTemplate) => {
  try {
    await setDefaultTemplate(template.id)
    toast.success(t('invoice.numberingTemplate.actions.setDefaultTemplate.success'))
  } catch (err) {
    handleErrorWithToast(t('invoice.numberingTemplate.actions.setDefaultTemplate.error'), err)
  }
}

const handleDeleteTemplate = async (id: string) => {
  try {
    await deleteTemplate(id)
    toast.success(t('invoice.numberingTemplate.actions.deleteTemplate.success'))
  } catch (err) {
    handleErrorWithToast(t('invoice.numberingTemplate.actions.deleteTemplate.error'), err)
  } finally {
    deleteConfirmId.value = null
  }
}

const handleDeleteConfirm = (id: string) => {
  deleteConfirmId.value = id
}

const handleTemplateSubmit = () => {
  showTemplateModal.value = false
}
</script>

<template>
  <div class="flex flex-col gap-6 border rounded-md p-4 shadow-lg/5">
    <TenantSectionTitle :title="t('invoice.numberingTemplate.title')" :subtitle="t('invoice.numberingTemplate.subtitle')">
      <template #actions>
        <RefreshIconButton :loading @click="refetch()" />
      </template>
    </TenantSectionTitle>

    <div v-if="loading && !numberingTemplates.length" class="flex justify-center py-8">
      <div class="text-muted-foreground">
        {{ t('invoice.numberingTemplate.states.loading') }}
      </div>
    </div>

    <div v-else-if="error" class="flex justify-center py-8">
      <div class="text-destructive">
        {{ error }}
      </div>
    </div>

    <Tabs
      v-else
      default-value="basic"
      class="w-full"
      :class="{ 'opacity-50': loading }"
    >
      <TabsList class="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
        <TabsTrigger
          v-for="group in groupedTemplates"
          :key="group.key"
          :value="group.key"
          class="text-xs"
        >
          {{ t(group.label) }}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        v-for="group in groupedTemplates"
        :key="group.key"
        :value="group.key"
        class="space-y-6 pl-2"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">
              {{ t(getInvoiceTypeLabel(group.baseType)) }}
            </h3>
            <Button size="sm" @click="handleAddTemplate(group.baseType)">
              <Plus class="size-4" />
              {{ t('invoice.numberingTemplate.actions.add') }}
            </Button>
          </div>

          <div v-if="group.templates.base.length === 0" class="text-center py-8">
            <p class="text-muted-foreground">
              {{ t('invoice.numberingTemplate.states.noTemplates') }}
            </p>
            <Button
              variant="outline"
              class="mt-2"
              @click="handleAddTemplate(group.baseType)"
            >
              {{ t('invoice.numberingTemplate.states.addFirstTemplate') }}
            </Button>
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <NumberingTemplateCard
              v-for="template in group.templates.base"
              :key="template.id"
              :template="template"
              @edit="handleEditTemplate"
              @set-default="handleSetDefault"
              @delete="handleDeleteConfirm"
            />
          </div>
        </div>

        <Separator />

        <div v-if="group.correctionType" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">
              {{ t(getInvoiceTypeLabel(group.correctionType)) }}
            </h3>
            <Button
              size="sm"
              @click="handleAddTemplate(group.correctionType)"
            >
              <Plus class="size-4" />
              {{ t('invoice.numberingTemplate.actions.add') }}
            </Button>
          </div>

          <div v-if="group.templates.correction.length === 0" class="text-center py-8">
            <p class="text-muted-foreground">
              {{ t('invoice.numberingTemplate.states.noTemplates') }}
            </p>
            <Button
              variant="outline"
              class="mt-2"
              @click="handleAddTemplate(group.correctionType)"
            >
              {{ t('invoice.numberingTemplate.states.addFirstTemplate') }}
            </Button>
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <NumberingTemplateCard
              v-for="template in group.templates.correction"
              :key="template.id"
              :template="template"
              @edit="handleEditTemplate"
              @set-default="handleSetDefault"
              @delete="handleDeleteConfirm"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>

    <NumberingTemplateFormModal
      v-model:open="showTemplateModal"
      :template="selectedTemplate"
      :invoice-type="selectedInvoiceType"
      @submit="handleTemplateSubmit"
    />

    <NumberingTemplateDeleteModal
      :open="!!deleteConfirmId"
      :loading="isDeleting"
      @update:open="(open) => !open && (deleteConfirmId = null)"
      @confirm="handleDeleteTemplate(deleteConfirmId!)"
    />
  </div>
</template>
