<script setup lang="ts">
import { useRoute } from 'vue-router'
import InvoiceTemplateEditor from '@/domains/invoice/components/invoiceTemplates/InvoiceTemplateEditor.vue'
import { useInvoiceTemplates } from '@/domains/invoice/helpers/useInvoiceTemplates'
import type { TUUID } from '@/domains/shared/types/common'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const route = useRoute()

const { invoiceTemplates } = useInvoiceTemplates()

const templateId = route.params.templateId as TUUID | null
const parentId = route.query.parentId as TUUID | null

defineProps<{
  tenant?: ITenant
}>()
</script>

<template>
  <InvoiceTemplateEditor
    :template-id="templateId"
    :invoice-templates="invoiceTemplates"
    :parent-id="parentId"
    :tenant-id="tenant?.id ?? ''"
  />
</template>

