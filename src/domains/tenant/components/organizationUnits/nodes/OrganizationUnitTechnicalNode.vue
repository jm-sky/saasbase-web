<script setup lang="ts">
import { type NodeProps } from '@vue-flow/core'
import { Lock } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { cn } from '@/lib/utils'
import type { OrganizationUnitNodeData } from '../../../composables/useOrganizationChartLayout'
import type { IOrganizationUnit } from '../../../types/organizationUnit.type'
import OrganizationUnitUserAvatarsList from '../OrganizationUnitUserAvatarsList.vue'

const { t } = useI18n()

const props = defineProps<{
  nodeProps: NodeProps<OrganizationUnitNodeData>
  isSelected?: boolean
}>()

const unit = computed<IOrganizationUnit>(() => props.nodeProps.data)
</script>

<template>
  <div>
    <div
      class="min-w-40 p-3 rounded-lg bg-muted border-border border shadow-sm transition-all duration-200 cursor-pointer hover:border-border"
      :class="cn('hover:border-border', isSelected && 'hover:border-primary border-primary/50 shadow-primary/10')"
    >
      <div class="font-semibold text-sm leading-tight mb-1 flex items-center justify-between gap-1.5">
        {{ t(`tenant.organizationUnits.technical.${unit.code}`) }}

        <Lock class="size-4 text-muted-foreground/50 shrink-0" />
      </div>

      <div class="text-xs mb-1 px-2 py-1 font-mono rounded inline-block text-gray-400 bg-gray-50">
        {{ unit.code }}
      </div>

      <div v-if="unit.description" class="text-xs mb-1.5 leading-snug text-gray-300">
        {{ unit.description }}
      </div>

      <div v-if="unit.users?.length" class="text-xs font-medium mb-1 text-gray-300">
        {{ unit.users.length }} user{{ unit.users.length !== 1 ? 's' : '' }}
      </div>

      <OrganizationUnitUserAvatarsList :users="unit.users.slice(0, 4)" class="mt-1" editable />
    </div>
  </div>
</template>
