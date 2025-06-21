<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import { Scan } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DataListSection from '@/components/DataLists/DataListSection.vue'
import Button from '@/components/ui/button/Button.vue'
import { useToast } from '@/components/ui/toast'
import AttachmentListWrapper from '@/domains/shared/components/attachments/AttachmentListWrapper.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { expenseAttachmentsService } from '../../services/expenseAttachmentsService'
import { expenseService } from '../../services/expenseService'
import type { IAttachment } from '@/domains/shared/types/attachment.type'

const { toast } = useToast()
const { t } = useI18n()

const { expenseId } = defineProps<{
  expenseId?: string | null
}>()

const listWrapper = templateRef('listWrapper')

const loading = computed(() => listWrapper.value?.loading ?? false)

const refresh = async () => {
  await listWrapper.value?.refresh()
}

const startOcr = async (attachment: IAttachment) => {
  if (!expenseId) return
  try {
    await expenseService.startOcr(expenseId, attachment.id)
    toast.success(t('financial.actions.startOcr.success'))
    await refresh()
  } catch (err) {
    handleErrorWithToast(t('financial.actions.startOcr.error'), err)
  }
}
</script>

<template>
  <DataListSection
    :title="t('attachments.title')"
    :loading="loading"
    :with-add-button="false"
    @refresh="refresh"
  >
    <AttachmentListWrapper
      ref="listWrapper"
      :model-id="expenseId"
      :service="expenseAttachmentsService"
      multiple
      downloadable
      viewable
      with-icon
    >
      <template #meta="{ meta }">
        <span v-if="meta?.isOcr">
          ·
          <span class="text-primary font-semibold">
            {{ t('attachments.meta.ocr') }}
          </span>
        </span>
      </template>
      <template #actions="{ attachment }">
        <Button
          v-tooltip="t('financial.actions.startOcr.tooltip')"
          size="icon"
          variant="ghost"
          @click="startOcr(attachment)"
        >
          <Scan class="size-4" />
        </Button>
      </template>
    </AttachmentListWrapper>
  </DataListSection>
</template>
