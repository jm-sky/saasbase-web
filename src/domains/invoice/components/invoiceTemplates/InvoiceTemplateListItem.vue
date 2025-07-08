<script setup lang="ts">
import { LockIcon, LockOpenIcon, Pencil, Star, Trash, Zap } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import { useToast } from '@/components/ui/toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IInvoiceTemplate } from '../../types/invoiceTemplate.type'
import { invoiceTemplateService } from '../../services/InvoiceTemplate.service'

const { t } = useI18n()
const { toast } = useToast()

defineProps<{
  template: IInvoiceTemplate
}>()

const emit = defineEmits<{
  'changed-active-state': [template: IInvoiceTemplate]
  'changed-default-status': [template: IInvoiceTemplate]
  'deleted': [template: IInvoiceTemplate]
  'edit': [template: IInvoiceTemplate]
}>()

const toggleDefault = async (template: IInvoiceTemplate) => {
  if (template.isDefault || template.isSystem) return

  try {
    await invoiceTemplateService.setDefault(template.id)
    toast.success(t('tenant.invoiceTemplates.setDefault.success'))
    emit('changed-default-status', template)
  } catch (error) {
    handleErrorWithToast(t('tenant.invoiceTemplates.setDefault.error'), error)
  }
}

const toggleActive = async (template: IInvoiceTemplate) => {
  if (template.isSystem) return

  try {
    if (template.isActive) {
      await invoiceTemplateService.deactivate(template.id)
      toast.success(t('tenant.invoiceTemplates.activate.success'))
    } else {
      await invoiceTemplateService.activate(template.id)
      toast.success(t('tenant.invoiceTemplates.activate.success'))
    }
    emit('changed-active-state', template)
  } catch (error) {
    handleErrorWithToast(t('tenant.invoiceTemplates.activate.error'), error)
  }
}

const deleteTemplate = async (template: IInvoiceTemplate) => {
  if (template.isSystem || template.isDefault) return

  if (!confirm(t('tenant.invoiceTemplates.delete.confirm', { name: template.name }))) {
    return
  }

  try {
    await invoiceTemplateService.delete(template.id)
    toast.success(t('tenant.invoiceTemplates.delete.success'))
    emit('deleted', template)
  } catch (error) {
    handleErrorWithToast(t('tenant.invoiceTemplates.delete.error'), error)
  }
}
</script>

<template>
  <div class="bg-card border border-border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <LockIcon v-if="template.isSystem" class="size-4 opacity-50" />
            <LockOpenIcon v-else class="size-4 opacity-50" />
            {{ template.name }}
          </h3>
          <Badge v-if="template.isSystem" variant="info-outline">
            {{ t('tenant.invoiceTemplates.system') }}
          </Badge>
          <Badge v-if="template.isDefault" variant="success-outline">
            {{ t('tenant.invoiceTemplates.default') }}
          </Badge>
          <Badge :variant="template.isActive ? 'success-outline' : 'destructive-outline'">
            {{ template.isActive ? $t('common.active') : $t('common.inactive') }}
          </Badge>
        </div>
        <p v-if="template.description" class="text-muted-foreground mb-2">
          {{ template.description }}
        </p>
        <div class="text-sm text-gray-500">
          {{ t('tenant.invoiceTemplates.category') }}: {{ template.category }}
        </div>
      </div>
      <div class="flex gap-1 ml-4">
        <Button
          v-tooltip="t('common.edit')"
          :disabled="template.isSystem"
          variant="ghost"
          size="icon"
          @click="emit('edit', template)"
        >
          <Pencil class="size-4" />
        </Button>
        <Button
          v-tooltip="t('tenant.invoiceTemplates.setDefault.setAsDefault')"
          :disabled="template.isDefault || template.isSystem"
          variant="ghost"
          size="icon"
          @click="toggleDefault(template)"
        >
          <Star class="size-4" />
        </Button>
        <Button
          v-tooltip="template.isActive ? $t('common.deactivate') : $t('common.activate')"
          :disabled="template.isSystem"
          variant="ghost"
          size="icon"
          @click="toggleActive(template)"
        >
          <Zap class="size-4" />
        </Button>
        <Button
          v-tooltip="t('common.delete')"
          :disabled="template.isSystem || template.isDefault"
          variant="ghost-destructive"
          size="icon"
          @click="deleteTemplate(template)"
        >
          <Trash class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
