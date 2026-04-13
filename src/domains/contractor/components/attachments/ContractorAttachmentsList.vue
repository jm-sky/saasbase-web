<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import DataListSection from '@/components/DataLists/DataListSection.vue'
import { contractorAttachmentsService } from '@/domains/contractor/services/ContractorAttachmentsService'
import AttachmentListWrapper from '@/domains/shared/components/attachments/AttachmentListWrapper.vue'

const { t } = useI18n()

defineProps<{
  contractorId?: string | null
}>()

const listWrapper = useTemplateRef('listWrapper')

const refresh = async () => {
  await listWrapper.value?.refresh()
}

const loading = computed(() => listWrapper.value?.loading ?? false)
</script>

<template>
  <DataListSection
    :title="t('attachments.title')"
    :with-add-button="false"
    :loading="loading"
    @refresh="refresh"
  >
    <AttachmentListWrapper
      ref="listWrapper"
      :model-id="contractorId"
      :service="contractorAttachmentsService"
      downloadable
      viewable
      with-icon
    />
  </DataListSection>
</template>
