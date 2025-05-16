<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import TagList from '@/components/DataLists/TagList.vue'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import InfoSection from '@/components/Sections/InfoSection.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { contractorLogoService } from '@/domains/contractor/services/ContractorLogoService'
import { contractorService } from '@/domains/contractor/services/ContractorService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IContractor } from '@/domains/contractor/models/contractor.model'

const { t } = useI18n()
const route = useRoute()
const contractorId = route.params.id as string

const contractor = ref<IContractor>()
const loading = ref(false)
const error = ref<string | null>(null)

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    contractor.value = await contractorService.get(contractorId)
  } catch (err) {
    handleErrorWithToast(t('contractor.show.error'), err)
    error.value = 'Failed to load contractor'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      v-if="contractor"
      :title="t('contractor.contractorDetails')"
      :back-link="'/contractors'"
      :edit-link="`/contractors/${contractorId}/edit`"
      :name="contractor.name"
      :email="contractor.email"
      :logo="contractor.logoUrl"
      :loading
      @refresh="refresh"
    >
      <template #back-link-text>
        {{ t('contractor.title') }}
      </template>

      <template #sidebar>
        <AvatarUploader
          :model-id="contractorId"
          :avatar-url="contractor.logoUrl"
          :uploader-service="contractorLogoService"
          auto-upload
          size="lg"
          @uploaded="refresh"
          @removed="refresh"
        />

        <div class="font-bold">
          {{ contractor.name ?? '...' }}
        </div>

        <div v-if="contractor.email" class="text-sm text-muted-foreground">
          {{ contractor.email ?? '...' }}
        </div>

        <Separator class="my-2" />

        <div class="flex flex-col gap-3 text-left">
          <InfoSection :label="t('contractor.fields.description')" :value="contractor.description" />
          <InfoSection :label="t('contractor.fields.taxId')" :value="contractor.taxId" />
          <InfoSection :label="t('contractor.fields.email')" :value="contractor.email" />
          <InfoSection :label="t('contractor.fields.phone')" :value="contractor.phone" />
          <InfoSection :label="t('contractor.fields.tags')">
            <TagList :tags="contractor.tags" />
          </InfoSection>
          <InfoSection :label="t('contractor.fields.createdAt')" :value="toDateTimeString(contractor.createdAt)" />
          <InfoSection :label="t('contractor.fields.updatedAt')" :value="toDateTimeString(contractor.updatedAt)" />
        </div>
      </template>

      <template #tabs>
        <RouterLink
          :to="`/contractors/${contractorId}/show/overview`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          Overview
        </RouterLink>
        <RouterLink
          :to="`/contractors/${contractorId}/show/comments`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          Comments
        </RouterLink>
        <RouterLink
          :to="`/contractors/${contractorId}/show/logs`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          Logs
        </RouterLink>
      </template>

      <template #content>
        <RouterView v-if="contractor" :contractor />
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
