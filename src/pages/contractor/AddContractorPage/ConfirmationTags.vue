<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/badge/Badge.vue'
import type { ICompanyRegistryConfirmation } from '@/domains/utils/types/companyLookup.type'

const { t } = useI18n()

defineProps<{
  registryConfirmation: ICompanyRegistryConfirmation
}>()
</script>

<template>
  <div class="flex flex-row gap-2 items-center justify-end">
    <Badge v-if="registryConfirmation?.regon" v-tooltip="t('company.sources.tooltip.regon')" variant="success-outline">
      <ShieldCheck class="size-4 mr-2" />
      REGON
    </Badge>
    <Badge v-if="registryConfirmation?.vies" v-tooltip="t('company.sources.tooltip.vies')" variant="success-outline">
      <ShieldCheck class="size-4 mr-2" />
      VIES
    </Badge>
    <Badge v-if="registryConfirmation?.mf" v-tooltip="t('company.sources.tooltip.mf')" variant="success-outline">
      <ShieldCheck class="size-4 mr-2" />
      MF
    </Badge>
  </div>
</template>