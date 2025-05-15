<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { type IContractorAttachment } from '@/domains/contractor/services/ContractorAttachmentsService'

const { t } = useI18n()

defineProps<{
  attachment: IContractorAttachment
  contractorId: string
}>()

const emit = defineEmits<{
  download: [attachment: IContractorAttachment]
  delete: [attachment: IContractorAttachment]
}>()
</script>

<template>
  <div class="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center px-3 py-2 text-sm border rounded-md">
    <div>{{ attachment.fileName }}</div>
    <div>{{ (attachment.size / 1024).toFixed(1) }} KB</div>
    <div>{{ attachment.mimeType }}</div>
    <div>{{ new Date(attachment.createdAt).toLocaleString() }}</div>
    <div class="flex flex-row gap-1 justify-end">
      <Button
        v-tooltip="t('common.download')"
        variant="ghost"
        size="sm"
        @click="emit('download', attachment)"
      >
        <Icon icon="lucide:download" />
      </Button>
      <Button
        v-tooltip="t('common.delete')"
        variant="ghost"
        size="sm"
        @click="emit('delete', attachment)"
      >
        <Icon icon="lucide:trash" />
      </Button>
    </div>
  </div>
</template>
