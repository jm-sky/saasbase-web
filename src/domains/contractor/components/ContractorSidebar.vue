<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import InfoSection from '@/components/Sections/InfoSection.vue'
import TagList from '@/components/TagList.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IContractor } from '../types/contractor.type'
import { contractorLogoService } from '../services/ContractorLogoService'

const { t } = useI18n()

defineProps<{
  contractorId: string
  contractor?: IContractor
}>()

const emit = defineEmits<{
  refresh: []
}>()

</script>

<template>
  <AvatarUploader
    :model-id="contractorId"
    :avatar-url="contractor?.logoUrl"
    :uploader-service="contractorLogoService"
    :disabled="!contractor?.id"
    auto-upload
    size="lg"
    @uploaded="emit('refresh')"
    @removed="emit('refresh')"
  />

  <div class="font-bold">
    {{ contractor?.name ?? '...' }}
  </div>

  <div v-if="contractor?.email" class="text-sm text-muted-foreground">
    {{ contractor?.email ?? '...' }}
  </div>

  <Separator class="my-2" />

  <div class="flex flex-col gap-3 text-left">
    <InfoSection :label="t('contractor.fields.description')" :value="contractor?.description" />
    <InfoSection :label="t('contractor.fields.vatId')" :value="contractor?.vatId" />
    <InfoSection :label="t('contractor.fields.regon')" :value="contractor?.regon" />
    <InfoSection :label="t('contractor.fields.taxId')" :value="contractor?.taxId" />
    <InfoSection :label="t('contractor.fields.email')" :value="contractor?.email" />
    <InfoSection :label="t('contractor.fields.phone')" :value="contractor?.phone" />
    <InfoSection :label="t('contractor.fields.tags')">
      <TagList :tags="contractor?.tags ?? []" />
    </InfoSection>
    <InfoSection v-if="contractor" :label="t('common.fields.createdAt')" :value="toDateTimeString(contractor.createdAt)" />
    <InfoSection v-if="contractor" :label="t('common.fields.updatedAt')" :value="toDateTimeString(contractor.updatedAt)" />
  </div>
</template>
