<script setup lang="ts">
import { type GraphNode, type NodeMouseEvent, VueFlow } from '@vue-flow/core'
import { ref, toRef, watch } from 'vue'
import type { IOrganizationUnit } from '../../types/organizationUnit.type'
import { useOrganizationChartLayout } from '../../composables/useOrganizationChartLayout'
import OrganizationUnitNode from './OrganizationUnitNode.vue'

const props = defineProps<{
  organizationUnits: IOrganizationUnit[]
}>()

const emit = defineEmits<{
  'unit-click': [unit: IOrganizationUnit]
  'unit-select': [unit: IOrganizationUnit | null]
}>()

const selectedNodeId = ref<string | null>(null)

// Use the layout composable
const { nodes, edges } = useOrganizationChartLayout(
  toRef(props, 'organizationUnits'),
  selectedNodeId
)

const onNodeClick = (event: NodeMouseEvent) => {
  const clickedNode = event.node as GraphNode<IOrganizationUnit>
  selectedNodeId.value = selectedNodeId.value === clickedNode.id ? null : clickedNode.id

  emit('unit-click', clickedNode.data)
  emit('unit-select', selectedNodeId.value ? clickedNode.data : null)
}

const onPaneClick = () => {
  selectedNodeId.value = null
  emit('unit-select', null)
}

// Reset selection when organization units change
watch(() => props.organizationUnits, () => {
  selectedNodeId.value = null
}, { deep: true })
</script>

<template>
  <div class="min-h-96 max-h-[600px] w-full bg-gray-50 rounded-lg border border-gray-200">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :default-zoom="0.8"
      :min-zoom="0.1"
      :max-zoom="2"
      :fit-view-on-init="true"
      :nodes-draggable="false"
      :nodes-connectable="false"
      :elements-selectable="false"
      class="bg-gray-50"
      @node-click="onNodeClick"
      @pane-click="onPaneClick"
    >
      <template #node-default="{ data }">
        <OrganizationUnitNode
          :data="data"
          :is-root="nodes.findIndex(n => n.id === data.id.toString()) === 0"
          :is-selected="selectedNodeId === data.id.toString()"
        />
      </template>
    </VueFlow>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
</style>

<style scoped>
@reference "tailwindcss";

:deep(.vue-flow__node-default) {
  border: none !important;
  background: none !important;
}

/* Vue Flow customizations */
:deep(.vue-flow__node) {
  @apply cursor-pointer;
}

:deep(.vue-flow__edge) {
  @apply pointer-events-none;
}

:deep(.vue-flow__controls) {
  @apply bg-white border border-gray-200 rounded-md;
}

:deep(.vue-flow__controls button) {
  @apply bg-white border-0 text-gray-700;
}

:deep(.vue-flow__controls button:hover) {
  @apply bg-gray-50;
}
</style>
