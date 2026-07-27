<script setup lang="ts">
import { Hourglass, ShieldCheck, TriangleAlertIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import InfoSection from '@/components/Sections/InfoSection.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import TagList from '@/domains/tags/components/TagList.vue'
import TagsEditable from '@/domains/tags/components/TagsEditable.vue'
import { toDateTimeString } from '@/lib/toDateTimeString'
import { contractorLogoService } from '../services/ContractorLogoService'
import { contractorTagsService } from '../services/ContractorTagsService'
import type { IContractor } from '../types/contractor.type'
import type { BadgeVariants } from '@/components/ui/badge'
import type { IRegistryConfirmation } from '@/domains/shared/types/registryConfirmation'

const { t } = useI18n()

const { contractor } = defineProps<{
  contractorId?: string
  contractor?: IContractor | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()

const getConfirmationIcon = (confirmation: IRegistryConfirmation) => {
  if (confirmation.status === 'success') return ShieldCheck
  if (confirmation.status === 'pending') return Hourglass
  return TriangleAlertIcon
}

const getConfirmationBadgeVariant = (confirmation: IRegistryConfirmation): BadgeVariants['variant'] => {
  if (confirmation.status === 'success') return 'success-outline'
  if (confirmation.status === 'pending') return 'draft-outline'
  return 'destructive-outline'
}
</script>

<template>
  <AvatarUploader
    :model-id="contractorId"
    :avatar-url="contractor?.logoUrl"
    :uploader-service="contractorLogoService"
    auto-upload
    size="lg"
    :disabled
    @uploaded="emit('refresh')"
    @removed="emit('refresh')"
  />

  <div class="font-bold">
    {{ contractor?.name ?? '...' }}
  </div>

  <div v-if="contractor?.email" class="text-sm text-muted-foreground">
    {{ contractor?.email ?? '...' }}
  </div>

  <template v-if="contractor?.registryConfirmations">
    <Separator class="my-2" />

    <div class="flex flex-row items-center justify-center gap-1 text-left">
      <Badge
        v-for="confirmation in contractor.registryConfirmations"
        :key="confirmation.id"
        v-tooltip="t(`company.sources.tooltip.${confirmation.type}`)"
        :variant="getConfirmationBadgeVariant(confirmation)"
      >
        <component :is="getConfirmationIcon(confirmation)" class="size-4 mr-1" />
        {{ confirmation.type.toUpperCase() }}
      </Badge>
    </div>
  </template>


  <Separator class="my-2" />

  <div class="flex flex-col gap-3 text-left text-sm">
    <InfoSection :label="t('contractor.fields.description')" :value="contractor?.description" />
    <InfoSection :label="t('contractor.fields.vatId')" :value="contractor?.vatId" />
    <InfoSection :label="t('contractor.fields.regon')" :value="contractor?.regon" />
    <InfoSection :label="t('contractor.fields.taxId')" :value="contractor?.taxId" />
    <InfoSection :label="t('contractor.fields.email')" :value="contractor?.email" />
    <InfoSection :label="t('contractor.fields.phone')" :value="contractor?.phone" />
    <InfoSection :label="t('contractor.fields.tags')">
      <TagList
        v-if="contractor && disabled"
        :tags="contractor.tags"
      />
      <TagsEditable
        v-if="contractor && !disabled"
        :model-value="contractor.tags"
        :tag-service="contractorTagsService"
        :model-id="contractor.id"
      />
    </InfoSection>
    <InfoSection v-if="contractor" :label="t('common.fields.createdAt')" :value="toDateTimeString(contractor.createdAt)" />
    <InfoSection v-if="contractor" :label="t('common.fields.updatedAt')" :value="toDateTimeString(contractor.updatedAt)" />
  </div>
</template>
