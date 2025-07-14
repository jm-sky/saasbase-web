<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import Button from '@/components/ui/button/Button.vue'
import UIIcon from '@/components/UIIcon.vue'
import InvoiceTemplateListItem from '@/domains/invoice/components/invoiceTemplates/InvoiceTemplateListItem.vue'
import { invoiceTemplateService } from '@/domains/invoice/services/InvoiceTemplate.service'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { routeMap } from '@/router/routeMap'
import type { IInvoiceTemplatePreview } from '@/domains/invoice/types/invoiceTemplate.type'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const { t } = useI18n()

const props = defineProps<{
  tenant?: ITenant
}>()

// State
const isLoading = ref(false)
const invoiceTemplates = ref<IInvoiceTemplatePreview[]>([])
const activeFilter = ref<'all' | 'system' | 'tenant'>('all')

// Computed
const filteredTemplates = computed(() => invoiceTemplates.value.filter(template => {
  if (activeFilter.value === 'system') return template.isSystem
  if (activeFilter.value === 'tenant') return !template.isSystem
  return true
}))

// Methods
const loadTemplates = async () => {
  try {
    isLoading.value = true
    invoiceTemplates.value = (await invoiceTemplateService.index()).data
  } catch (error) {
    handleErrorWithToast(t('tenant.invoiceTemplates.list.loadError'), error)
  } finally {
    isLoading.value = false
  }
}

const createNewTemplateRoute = () => {
  return {
    name: routeMap.tenant.financialSettings.invoiceTemplatesCreate,
    params: { id: props.tenant?.id ?? '' }
  }
}

// Lifecycle
onMounted(() => {
  void loadTemplates()
})
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <TenantSectionTitle :title="t('tenant.invoiceTemplates.title')">
      <template #actions>
        <ButtonLink variant="primary" :to="createNewTemplateRoute()">
          <Plus class="size-4" />
          {{ t('tenant.invoiceTemplates.createTemplate') }}
        </ButtonLink>
      </template>
    </TenantSectionTitle>

    <div class="flex flex-col gap-6">
      <!-- Template List -->
      <div>
        <div class="mb-6">
          <div class="flex flex-wrap gap-4 mb-4">
            <Button
              :variant="activeFilter === 'all' ? 'primary' : 'outline'"
              @click="activeFilter = 'all'"
            >
              <UIIcon :icon="activeFilter === 'all' ? 'lucide:circle-check' : 'lucide:circle'" class="size-4" />
              {{ t('tenant.invoiceTemplates.filters.all') }}
            </Button>
            <Button
              :variant="activeFilter === 'system' ? 'primary' : 'outline'"
              @click="activeFilter = 'system'"
            >
              <UIIcon :icon="activeFilter === 'system' ? 'lucide:circle-check' : 'lucide:circle'" class="size-4" />
              {{ t('tenant.invoiceTemplates.filters.system') }}
            </Button>
            <Button
              :variant="activeFilter === 'tenant' ? 'primary' : 'outline'"
              @click="activeFilter = 'tenant'"
            >
              <UIIcon :icon="activeFilter === 'tenant' ? 'lucide:circle-check' : 'lucide:circle'" class="size-4" />
              {{ t('tenant.invoiceTemplates.filters.tenant') }}
            </Button>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-8">
          <LoadingIcon class="mx-auto mb-2" />
          {{ t('common.loading') }}
        </div>

        <div v-else-if="filteredTemplates.length === 0" class="text-center py-8 text-gray-500">
          {{ t('tenant.invoiceTemplates.list.noTemplates') }}
        </div>

        <div v-else class="grid gap-4">
          <InvoiceTemplateListItem
            v-for="template in filteredTemplates"
            :key="template.id"
            :tenant-id="tenant?.id ?? ''"
            :template="template"
            @changed-active-state="loadTemplates()"
            @changed-default-status="loadTemplates()"
            @deleted="loadTemplates()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

