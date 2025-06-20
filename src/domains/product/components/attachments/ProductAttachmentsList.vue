<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import DataListSection from '@/components/DataLists/DataListSection.vue'
import AttachmentListWrapper from '@/domains/shared/components/AttachmentListWrapper.vue'
import { productAttachmentsService } from '../../services/ProductAttachmentsService'

const route = useRoute()
const { t } = useI18n()

const productId = route.params.id as string

const listWrapper = templateRef('listWrapper')

const refresh = async () => {
  await listWrapper.value?.refresh()
}

</script>

<template>
  <DataListSection
    :title="t('attachments.title')"
    :loading="listWrapper?.loading"
    :with-add-button="false"
    @refresh="refresh"
  >
    <AttachmentListWrapper
      ref="listWrapper"
      :model-id="productId"
      :service="productAttachmentsService"
      downloadable
      viewable
      with-icon
    />
  </DataListSection>
</template>
