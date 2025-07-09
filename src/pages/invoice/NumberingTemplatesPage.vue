<script setup lang="ts">
import { Edit, MoreVertical, Plus, Star, Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/toast'
import NumberingTemplateDeleteModal from '@/domains/invoice/components/NumberingTemplateDeleteModal.vue'
import NumberingTemplateFormModal from '@/domains/invoice/components/NumberingTemplateFormModal.vue'
import { numberingTemplateService } from '@/domains/invoice/services/NumberingTemplate.service'
import { useNumberingTemplateStore } from '@/domains/invoice/stores/numberingTemplate.store'
import { getInvoiceTypeLabel, getResetPeriodLabel, groupTemplatesByInvoiceType } from '@/domains/invoice/utils/numberingTemplateUtils'
import type { TInvoiceType } from '@/domains/financial/types/financial.type'
import type { IInvoiceNumberingTemplate } from '@/domains/invoice/types/numberingTemplate.type'

const { t } = useI18n()
const { toast } = useToast()
const numberingTemplateStore = useNumberingTemplateStore()
const { numberingTemplates } = storeToRefs(numberingTemplateStore)

const loading = ref(false)
const error = ref<string | null>(null)
const showTemplateModal = ref(false)
const selectedTemplate = ref<IInvoiceNumberingTemplate | null>(null)
const selectedInvoiceType = ref<TInvoiceType | null>(null)
const deleteConfirmId = ref<string | null>(null)

const groupedTemplates = computed(() => {
  return groupTemplatesByInvoiceType(numberingTemplates.value)
})

const loadTemplates = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await numberingTemplateService.index()
    numberingTemplates.value = response.data
  } catch {
    error.value = 'Failed to load numbering templates'
    toast({
      title: t('invoice.numberingTemplate.states.error'),
      description: error.value,
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
}

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
    await numberingTemplateService.setDefault(template.id)
    await loadTemplates()
    toast({
      title: t('invoice.numberingTemplate.actions.setDefaultTemplate.success'),
      variant: 'default',
    })
  } catch {
    toast({
      title: t('invoice.numberingTemplate.actions.setDefaultTemplate.error'),
      variant: 'destructive',
    })
  }
}

const handleDeleteTemplate = async (id: string) => {
  try {
    await numberingTemplateService.delete(id)
    await loadTemplates()
    toast({
      title: t('invoice.numberingTemplate.actions.deleteTemplate.success'),
      variant: 'default',
    })
  } catch {
    toast({
      title: t('invoice.numberingTemplate.actions.deleteTemplate.error'),
      variant: 'destructive',
    })
  } finally {
    deleteConfirmId.value = null
  }
}

const handleDeleteConfirm = (id: string) => {
  deleteConfirmId.value = id
}

const handleTemplateSubmit = () => {
  showTemplateModal.value = false
  void loadTemplates()
}

onMounted(() => {
  void loadTemplates()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">
          {{ t('invoice.numberingTemplate.title') }}
        </h1>
        <p class="text-muted-foreground">
          {{ t('invoice.numberingTemplate.subtitle') }}
        </p>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="text-muted-foreground">
        {{ t('invoice.numberingTemplate.states.loading') }}
      </div>
    </div>

    <div v-else-if="error" class="flex justify-center py-8">
      <div class="text-destructive">
        {{ error }}
      </div>
    </div>

    <Tabs v-else default-value="basic" class="w-full">
      <TabsList class="grid w-full grid-cols-4 lg:grid-cols-8">
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
        class="space-y-6"
      >
        <!-- Base Templates -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">
              {{ t(getInvoiceTypeLabel(group.baseType)) }}
            </h3>
            <Button
              size="sm"
              @click="handleAddTemplate(group.baseType)"
            >
              <Plus class="size-4 mr-2" />
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
            <Card
              v-for="template in group.templates.base"
              :key="template.id"
              class="hover:shadow-md transition-shadow"
            >
              <CardHeader class="pb-2">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-sm">
                    {{ template.name }}
                  </CardTitle>
                  <div class="flex items-center gap-2">
                    <Badge v-if="template.isDefault" variant="secondary">
                      {{ t('invoice.numberingTemplate.states.default') }}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="sm">
                          <MoreVertical class="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="handleEditTemplate(template)">
                          <Edit class="size-4 mr-2" />
                          {{ t('invoice.numberingTemplate.actions.edit') }}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          v-if="!template.isDefault"
                          @click="handleSetDefault(template)"
                        >
                          <Star class="size-4 mr-2" />
                          {{ t('invoice.numberingTemplate.actions.setDefault') }}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          class="text-destructive"
                          @click="handleDeleteConfirm(template.id)"
                        >
                          <Trash2 class="size-4 mr-2" />
                          {{ t('invoice.numberingTemplate.actions.delete') }}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="space-y-2 text-sm">
                  <div class="font-mono bg-muted p-2 rounded">
                    {{ template.format }}
                  </div>
                  <div class="flex justify-between text-muted-foreground">
                    <span>{{ t('invoice.numberingTemplate.form.nextNumber') }}: {{ template.nextNumber }}</span>
                    <span>{{ t(getResetPeriodLabel(template.resetPeriod)) }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Correction Templates -->
        <div v-if="group.correctionType" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">
              {{ t(getInvoiceTypeLabel(group.correctionType)) }}
            </h3>
            <Button
              size="sm"
              @click="handleAddTemplate(group.correctionType)"
            >
              <Plus class="size-4 mr-2" />
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
            <Card
              v-for="template in group.templates.correction"
              :key="template.id"
              class="hover:shadow-md transition-shadow"
            >
              <CardHeader class="pb-2">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-sm">
                    {{ template.name }}
                  </CardTitle>
                  <div class="flex items-center gap-2">
                    <Badge v-if="template.isDefault" variant="secondary">
                      {{ t('invoice.numberingTemplate.states.default') }}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="sm">
                          <MoreVertical class="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="handleEditTemplate(template)">
                          <Edit class="size-4 mr-2" />
                          {{ t('invoice.numberingTemplate.actions.edit') }}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          v-if="!template.isDefault"
                          @click="handleSetDefault(template)"
                        >
                          <Star class="size-4 mr-2" />
                          {{ t('invoice.numberingTemplate.actions.setDefault') }}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          class="text-destructive"
                          @click="handleDeleteConfirm(template.id)"
                        >
                          <Trash2 class="size-4 mr-2" />
                          {{ t('invoice.numberingTemplate.actions.delete') }}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="space-y-2 text-sm">
                  <div class="font-mono bg-muted p-2 rounded">
                    {{ template.format }}
                  </div>
                  <div class="flex justify-between text-muted-foreground">
                    <span>{{ t('invoice.numberingTemplate.form.nextNumber') }}: {{ template.nextNumber }}</span>
                    <span>{{ t(getResetPeriodLabel(template.resetPeriod)) }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>

    <!-- Template Form Modal -->
    <NumberingTemplateFormModal
      v-model:open="showTemplateModal"
      :template="selectedTemplate"
      :invoice-type="selectedInvoiceType"
      @submit="handleTemplateSubmit"
    />
    
    <!-- Delete Confirmation Modal -->
    <NumberingTemplateDeleteModal
      :open="!!deleteConfirmId"
      :loading="loading"
      @update:open="(open) => !open && (deleteConfirmId = null)"
      @confirm="handleDeleteTemplate(deleteConfirmId!)"
    />
  </div>
</template>