<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { ArrowRight } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { routeMap } from '@/router/routeMap'
import EditOrganizationUnitModal from '../modals/EditOrganizationUnitModal.vue'
import OrganizationUnitUserAvatarsList from '../OrganizationUnitUserAvatarsList.vue'
import UnitToolbar from '../UnitToolbar.vue'
import type { OrganizationUnitNodeData } from '../../../composables/useOrganizationChartLayout'
import type { IOrganizationUnit } from '../../../types/organizationUnit.type'
import type { NodeProps } from '@vue-flow/core'

const props = defineProps<{
  nodeProps: NodeProps<OrganizationUnitNodeData>
  isSelected?: boolean
}>()

const isEditModalOpen = ref(false)

const emit = defineEmits<{
  'add-child': [unit: IOrganizationUnit]
}>()

const unit = computed<IOrganizationUnit>(() => props.nodeProps.data)

const handleEdit = () => {
  isEditModalOpen.value = true
}

const handleAddChild = () => {
  emit('add-child', unit.value)
}
</script>

<template>
  <div>
    <UnitToolbar
      :is-selected="isSelected"
      addable
      editable
      @add-child="handleAddChild"
      @edit="handleEdit"
    />

    <div
      class="min-w-40 p-5 rounded-lg border shadow-sm transition-all duration-200 cursor-pointer bg-card border-border hover:border-border"
      :class="cn('hover:border-border', isSelected && 'hover:border-primary border-primary/50 shadow-primary/10')"
    >
      <div class="font-semibold text-sm leading-tight mb-1 flex items-center justify-between gap-2">
        <span>{{ unit.name }}</span>
        <RouterLink
          v-if="!unit.isTechnical"
          :to="{ name: routeMap.tenant.userSettings.organizationUnit, params: { id: unit.tenantId, unitId: unit.id } }"
          class="text-primary hover:text-primary/80 transition-colors"
          title="View Details"
        >
          <ArrowRight class="size-3" />
        </RouterLink>
      </div>

      <div v-if="unit.description" class="text-xs mb-1.5 leading-snug text-gray-300">
        {{ unit.description }}
      </div>

      <OrganizationUnitUserAvatarsList :users="unit.users.slice(0, 4)" editable />

      <Handle
        v-if="nodeProps.data?.children?.length"
        type="source"
        :position="Position.Bottom"
        class="size-2.5 bg-white border-2 border-primary/50"
      />
    </div>

    <EditOrganizationUnitModal
      v-model:open="isEditModalOpen"
      :tenant-id="unit.tenantId"
      :unit="unit"
    />
  </div>
</template>
