<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import TabLink from '@/components/ui/tabs/TabLink.vue'
import ContractorSidebar from '@/domains/contractor/components/ContractorSidebar.vue'
import { useContractor } from '@/domains/contractor/composables/useContractorQueries'
import { useContractorStore } from '@/domains/contractor/store/contractor.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const { t } = useI18n()
const route = useRoute()

const contractorId = route.params.id as string
const contractorStore = useContractorStore()
const { contractor: storeContractor } = storeToRefs(contractorStore)

const { data: contractor, isPending: loading, refetch } = useContractor(contractorId)

watch(contractor, (value) => {
  if (value) contractorStore.setContractor(value)
}, { immediate: true })

const displayContractor = computed(() => contractor.value ?? storeContractor.value)

const tabs = computed(() => [
  {
    to: `/contractors/${contractorId}/show/overview`,
    label: t('contractor.overview.title'),
  },
  {
    to: `/contractors/${contractorId}/show/preferences`,
    label: t('contractor.preferences.title'),
  },
  {
    to: `/contractors/${contractorId}/show/comments`,
    label: t('contractor.comments.title'),
  },
  {
    to: `/contractors/${contractorId}/show/logs`,
    label: t('contractor.logs.title'),
  },
])
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      :title="t('contractor.contractorDetails')"
      :back-link="'/contractors'"
      :edit-link="`/contractors/${contractorId}/edit`"
      :name="displayContractor?.name"
      :email="displayContractor?.email"
      :logo="displayContractor?.logoUrl"
      :loading
      show-sidebar
      @refresh="refetch()"
    >
      <template #back-link-text>
        {{ t('contractor.title') }}
      </template>

      <template #sidebar>
        <ContractorSidebar :contractor-id="contractorId" :contractor="displayContractor" />
      </template>

      <template #tabs>
        <TabLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          :label="tab.label"
        />
      </template>

      <template #content>
        <RouterView v-if="displayContractor" :contractor="displayContractor" />
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
