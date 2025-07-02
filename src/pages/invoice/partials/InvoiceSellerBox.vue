<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FileDropZoneSlot from '@/components/Inputs/FileDropZoneSlot.vue'
import FileUploadClickable from '@/components/Inputs/FileUploadClickable.vue'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'

const { t } = useI18n()

defineProps<{
  values: IInvoiceCreate
}>()
</script>

<template>
  <div class="flex flex-col items-start justify-center gap-y-2 border-b p-6">
    <div class="w-full mb-4">
      <FileDropZoneSlot class="p-4 rounded-lg border border-dashed hover:bg-primary-50/50 hover:border-primary" :dragged-files="[]">
        <FileUploadClickable :files="[]">
          <template #label>
            {{ t('financial.logo.placeholder') }}
          </template>
        </FileUploadClickable>
      </FileDropZoneSlot>
    </div>

    <div class="font-bold text-xl text-primary">
      {{ values.seller.name }}
    </div>
    <div class="font-semibold text-sm">
      {{ values.seller.address }}
    </div>
    <div v-if="values.seller.taxId" class="font-semibold text-sm">
      Tax ID: {{ values.seller.taxId }}
    </div>
    <div v-if="values.seller.email" class="font-semibold text-sm">
      {{ values.seller.email }}
    </div>
  </div>
</template>
