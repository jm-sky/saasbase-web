<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import ContractorSidebar from '@/domains/contractor/components/ContractorSidebar.vue'
import { contractorService } from '@/domains/contractor/services/ContractorService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IContractor } from '@/domains/contractor/types/contractor.type'

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
      :title="t('contractor.contractorDetails')"
      :back-link="'/contractors'"
      :edit-link="`/contractors/${contractorId}/edit`"
      :name="contractor?.name"
      :email="contractor?.email"
      :logo="contractor?.logoUrl"
      :loading
      @refresh="refresh"
    >
      <template #back-link-text>
        {{ t('contractor.title') }}
      </template>

      <template #sidebar>
        <ContractorSidebar :contractor-id="contractorId" :contractor />
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
