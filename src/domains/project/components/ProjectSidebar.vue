<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import InfoSection from '@/components/Sections/InfoSection.vue'
import TagList from '@/components/TagList.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { productLogoService } from '@/domains/product/services/ProductLogoService'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IProject } from '../types/project.type'

const { t } = useI18n()

defineProps<{
  projectId?: string
  project?: IProject | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <AvatarUploader
    :model-id="projectId"
    :avatar-url="project?.logoUrl"
    :uploader-service="productLogoService"
    auto-upload
    size="lg"
    :disabled
    @uploaded="emit('refresh')"
    @removed="emit('refresh')"
  />

  <div class="font-bold">
    {{ project?.name ?? '...' }}
  </div>

  <Separator class="my-2" />

  <div class="flex flex-col gap-3 text-left">
    <InfoSection :label="t('product.fields.description')" :value="project?.description" />
    <InfoSection :label="t('product.fields.tags')">
      <TagList :tags="project?.tags ?? []" />
    </InfoSection>
    <InfoSection v-if="project" :label="t('product.fields.createdAt')" :value="toDateTimeString(project.createdAt)" />
    <InfoSection v-if="project" :label="t('product.fields.updatedAt')" :value="toDateTimeString(project.updatedAt)" />
  </div>
</template>
