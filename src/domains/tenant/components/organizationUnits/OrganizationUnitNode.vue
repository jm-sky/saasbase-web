<script setup lang="ts">
import { Handle, type NodeProps, Position } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { Edit, Plus, Trash } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import UserAvatarsList from '@/domains/user/components/UserAvatarsList.vue'
import { cn } from '@/lib/utils'
import type { OrganizationUnitNodeData } from '../../composables/useOrganizationChartLayout'
import type { IOrganizationUnit } from '../../types/organizationUnit.type'

const props = defineProps<{
  nodeProps: NodeProps<OrganizationUnitNodeData>
  isSelected?: boolean
}>()

const emit = defineEmits<{
  'add-child': [unit: IOrganizationUnit]
  remove: [unit: IOrganizationUnit]
}>()

const isEditModalOpen = ref(false)

const unit = computed<IOrganizationUnit>(() => props.nodeProps.data)

const handleAddChild = () => {
  emit('add-child', unit.value)
}

const handleEdit = () => {
  isEditModalOpen.value = true
}

const handleRemove = () => {
  emit('remove', unit.value)
}
</script>

<template>
  <div>
    <NodeToolbar :is-visible="isSelected" :position="Position.Left" class="flex flex-col gap-2 bg-card/30 border p-2 shadow rounded-xl backdrop-blur-xs">
      <Button variant="ghost" size="icon" @click="handleAddChild">
        <Plus class="size-4" />
      </Button>
      <Button variant="ghost" size="icon" @click="handleEdit">
        <Edit class="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="hover:text-destructive"
        @click="handleRemove"
      >
        <Trash class="size-4" />
      </Button>
    </NodeToolbar>

    <div
      class="min-w-40 p-3 rounded-lg border shadow-sm transition-all duration-200 cursor-pointer bg-card border-border hover:border-border"
      :class="cn('hover:border-border', isSelected && 'hover:border-primary border-primary/50 shadow-primary/10')"
    >
      <div class="font-semibold text-sm leading-tight mb-1">
        {{ unit.name }}
      </div>

      <div v-if="isEditModalOpen" class="p-4">
        Editing...
      </div>

      <div v-if="unit.description" class="text-xs mb-1.5 leading-snug text-gray-300">
        {{ unit.description }}
      </div>

      <div v-if="unit.users?.length" class="text-xs font-medium mb-1 text-gray-300">
        {{ unit.users.length }} user{{ unit.users.length !== 1 ? 's' : '' }}
      </div>

      <div v-if="unit.code" class="text-xs px-2 py-1 rounded inline-block text-gray-400 bg-gray-50">
        Code: {{ unit.code }}
      </div>

      <UserAvatarsList :users="unit.users.slice(0, 4)" class="mt-1" editable />

      <Handle type="target" :position="Position.Top" class="size-2.5 bg-white border-2 border-primary/50" />
      <Handle
        v-if="nodeProps.data?.children?.length"
        type="source"
        :position="Position.Bottom"
        class="size-2.5 bg-white border-2 border-primary/50"
      />
    </div>
  </div>
</template>
