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
  <div class="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center px-3 py-2 text-sm border rounded-md">
    <div class="order-0 max-w-full overflow-hidden truncate`">
      {{ attachment.fileName }}
    </div>

    <div class="col-span-full md:col-span-1 text-muted-foreground order-2 md:order-1">
      {{ (attachment.size / 1024).toFixed(1) }} KB
    </div>

    <div class="col-span-full md:col-span-1 text-muted-foreground order-3 md:order-2">
      {{ attachment.mimeType }}
    </div>

    <div class="col-span-full md:col-span-1 text-muted-foreground order-4 md:order-3">
      {{ new Date(attachment.createdAt).toLocaleString() }}
    </div>

    <div class="flex flex-row gap-0.5 justify-end order-1 md:order-5">
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
