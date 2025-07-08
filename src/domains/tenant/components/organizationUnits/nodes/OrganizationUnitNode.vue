<script setup lang="ts">
import { Handle, type NodeProps, Position } from '@vue-flow/core'
import { ArrowRight } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { tenantOrganizationUnitService } from '@/domains/tenant/services/TenantOrganizationUnit.service'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { cn } from '@/lib/utils'
import type { OrganizationUnitNodeData } from '../../../composables/useOrganizationChartLayout'
import type { IOrganizationUnit } from '../../../types/organizationUnit.type'
import AssignUserToOrganizationUnitModal from '../modals/AssignUserToOrganizationUnitModal.vue'
import EditOrganizationUnitModal from '../modals/EditOrganizationUnitModal.vue'
import OrganizationUnitUserAvatarsList from '../OrganizationUnitUserAvatarsList.vue'
import UnitToolbar from '../UnitToolbar.vue'

const { t } = useI18n()

const props = defineProps<{
  nodeProps: NodeProps<OrganizationUnitNodeData>
  isSelected?: boolean
}>()

const emit = defineEmits<{
  'add-child': [unit: IOrganizationUnit]
  remove: [unit: IOrganizationUnit]
}>()

const isRemoving = ref(false)
const isEditModalOpen = ref(false)
const isAssignUserModalOpen = ref(false)

const unit = computed<IOrganizationUnit>(() => props.nodeProps.data)

const handleAddChild = () => {
  emit('add-child', unit.value)
}

const handleEdit = () => {
  isEditModalOpen.value = true
}

const handleRemove = async () => {
  if (!confirm(t('tenant.organizationUnits.delete.confirm'))) return

  try {
    isRemoving.value = true
    await tenantOrganizationUnitService.delete(unit.value.tenantId, unit.value.id)
    emit('remove', unit.value)
  } catch (error) {
    handleErrorWithToast(t('tenant.organizationUnits.delete.error'), error)
  } finally {
    isRemoving.value = false
  }
}
</script>

<template>
  <div>
    <UnitToolbar
      v-if="!unit.isTechnical"
      :is-selected="isSelected"
      addable
      editable
      removeable
      @add-child="handleAddChild"
      @edit="handleEdit"
      @remove="handleRemove"
    />

    <div
      class="min-w-40 p-3 rounded-lg border shadow-sm transition-all duration-200 cursor-pointer bg-card border-border hover:border-border"
      :class="cn('hover:border-border', isSelected && 'hover:border-primary border-primary/50 shadow-primary/10', isRemoving && 'opacity-80 blur-xs')"
    >
      <div class="font-semibold text-sm leading-tight mb-1 flex items-center justify-between gap-2">
        <span>{{ unit.name }}</span>
        <RouterLink
          v-if="!unit.isTechnical"
          :to="{ name: 'tenant.show.organization-unit', params: { id: unit.tenantId, unitId: unit.id } }"
          class="text-primary hover:text-primary/80 transition-colors"
          title="View Details"
        >
          <ArrowRight class="h-3 w-3" />
        </RouterLink>
      </div>

      <div class="text-xs mb-1 px-2 py-1 font-mono rounded inline-block text-gray-400 bg-gray-50">
        {{ unit.code }}
      </div>

      <div v-if="unit.description" class="text-xs mb-1.5 leading-snug text-gray-300">
        {{ unit.description }}
      </div>

      <div class="text-xs font-medium mb-1 text-gray-300">
        {{ unit.users.length }} user{{ unit.users.length !== 1 ? 's' : '' }}
      </div>

      <OrganizationUnitUserAvatarsList
        :users="unit.users.slice(0, 4)"
        class="mt-1"
        editable
        @assign="isAssignUserModalOpen = true"
      />

      <Handle type="target" :position="Position.Top" class="size-2.5 bg-white border-2 border-primary/50" />
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

    <AssignUserToOrganizationUnitModal
      v-model:open="isAssignUserModalOpen"
      :tenant-id="unit.tenantId"
      :unit="unit"
    />
  </div>
</template>
