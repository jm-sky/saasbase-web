<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import type { IContractor, IContractorListItem } from '../../types/contractor.type'
import { useContractorStore } from '../../store/contractor.store'

const { t } = useI18n()
const contractorStore = useContractorStore()

const { withText = false, withIcon = true } = defineProps<{
  id: string
  contractor: IContractor | IContractorListItem
  withIcon?: boolean
  withText?: boolean
}>()
</script>

<template>
  <ButtonLink
    v-tooltip="t('common.edit', 'Edit')"
    variant="outline"
    size="sm"
    :to="`/contractors/${id}/edit`"
    @click="contractorStore.setContractor(contractor)"
  >
    <template v-if="withIcon">
      <Pencil />
    </template>
    <template v-if="withText">
      {{ t('common.edit', 'Edit') }}
    </template>
  </ButtonLink>
</template>
