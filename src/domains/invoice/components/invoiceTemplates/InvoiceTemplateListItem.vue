<script setup lang="ts">
import { Copy, LockIcon, LockOpenIcon, Pencil, Star, Trash, Zap } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import { useToast } from '@/components/ui/toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { routeMap } from '@/router/routeMap'
import type { IInvoiceTemplatePreview } from '../../types/invoiceTemplate.type'
import { useInvoiceTemplates } from '../../helpers/useInvoiceTemplates'
import { invoiceTemplateService } from '../../services/InvoiceTemplate.service'
import type { TUUID } from '@/domains/shared/types/common'

const { t } = useI18n()
const { toast } = useToast()
const { setTemplate } = useInvoiceTemplates()

const props = defineProps<{
  tenantId: TUUID
  template: IInvoiceTemplatePreview
}>()

const emit = defineEmits<{
  'changed-active-state': [template: IInvoiceTemplatePreview]
  'changed-default-status': [template: IInvoiceTemplatePreview]
  'deleted': [template: IInvoiceTemplatePreview]
}>()

const editTemplateRoute = computed(() => {
  return {
    name: routeMap.tenant.financialSettings.invoiceTemplatesEdit,
    params: {
      id: props.tenantId,
      templateId: props.template.id,
    }
  }
})

const copyTemplateRoute = computed(() => {
  return {
    name: routeMap.tenant.financialSettings.invoiceTemplatesEdit,
    params: { id: null },
    query: {
      id: props.tenantId,
      parentId: props.template.id,
    }
  }
})

const toggleDefault = async (template: IInvoiceTemplatePreview) => {
  if (template.isDefault || template.isSystem) return

  try {
    await invoiceTemplateService.setDefault(template.id)
    toast.success(t('tenant.invoiceTemplates.setDefault.success'))
    emit('changed-default-status', template)
  } catch (error) {
    handleErrorWithToast(t('tenant.invoiceTemplates.setDefault.error'), error)
  }
}

const toggleActive = async (template: IInvoiceTemplatePreview) => {
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

const deleteTemplate = async (template: IInvoiceTemplatePreview) => {
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
    <div class="flex justify-between items-start flex-wrap">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="flex items-center gap-2 text-lg font-semibold">
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
        <ButtonLink
          v-tooltip="t('common.edit')"
          :disabled="template.isSystem"
          variant="ghost"
          size="icon"
          :to="editTemplateRoute"
          @click="setTemplate(template)"
        >
          <Pencil class="size-4" />
        </ButtonLink>
        <ButtonLink
          v-tooltip="t('common.copy')"
          variant="ghost"
          size="icon"
          :to="copyTemplateRoute"
          @click="setTemplate(template)"
        >
          <Copy class="size-4" />
        </ButtonLink>
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
