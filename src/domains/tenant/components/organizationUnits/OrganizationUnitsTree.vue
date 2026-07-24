<script setup lang="ts">
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { type GraphNode, type NodeMouseEvent, VueFlow } from '@vue-flow/core'
import { MiniMap } from '@vue-flow/minimap'
import { toRef, watch } from 'vue'
import { useOrganizationChartLayout } from '../../composables/useOrganizationChartLayout'
import OrganizationUnitNode from './nodes/OrganizationUnitNode.vue'
import OrganizationUnitRootNode from './nodes/OrganizationUnitRootNode.vue'
import OrganizationUnitTechnicalNode from './nodes/OrganizationUnitTechnicalNode.vue'
import OrganizationUnitRelation from './OrganizationUnitRelation.vue'
import type { IOrganizationUnit } from '../../types/organizationUnit.type'

const props = defineProps<{
  organizationUnits: IOrganizationUnit[]
}>()

const emit = defineEmits<{
  'unit-click': [unit: IOrganizationUnit]
  'unit-select': [unit: IOrganizationUnit | null]
  'add-child': [unit: IOrganizationUnit]
  'remove': [unit: IOrganizationUnit]
}>()

const selectedNodeId = defineModel<string | null>('selectedNodeId', { default: null })
const selectedUnit = defineModel<IOrganizationUnit | null>('selectedUnit', { default: null })

const { nodes, edges, init, prepare } = useOrganizationChartLayout(toRef(props, 'organizationUnits'))

const onNodeClick = (event: NodeMouseEvent) => {
  const clickedNode = event.node as GraphNode<IOrganizationUnit>
  selectedNodeId.value = selectedNodeId.value === clickedNode.id ? null : clickedNode.id
  selectedUnit.value = selectedUnit.value === clickedNode.data ? null : clickedNode.data

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
  selectedUnit.value = null
  init()
  prepare()
}, { deep: true, immediate: true })
</script>

<template>
  <div class="min-h-[550px] max-h-[800px] w-full bg-gray-50 rounded-lg border border-gray-200">
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
      class="bg-gray-50 rounded-lg"
      @node-click="onNodeClick"
      @pane-click="onPaneClick"
    >
      <Background pattern-color="#006493" :gap="20" class="rounded-3xl" />

      <Controls position="top-left" />

      <MiniMap />

      <template #node-root="nodeProps">
        <OrganizationUnitRootNode
          :node-props="nodeProps"
          :is-selected="selectedNodeId === nodeProps.data.id.toString()"
          @add-child="emit('add-child', nodeProps.data)"
        />
      </template>

      <template #node-child="nodeProps">
        <OrganizationUnitNode
          :node-props="nodeProps"
          :is-selected="selectedNodeId === nodeProps.data.id.toString()"
          @add-child="emit('add-child', nodeProps.data)"
          @remove="emit('remove', nodeProps.data)"
        />
      </template>

      <template #node-technical="nodeProps">
        <OrganizationUnitTechnicalNode
          :node-props="nodeProps"
          :is-selected="selectedNodeId === nodeProps.data.id.toString()"
        />
      </template>

      <template #edge-custom="edgeProps">
        <OrganizationUnitRelation v-bind="edgeProps" />
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
  @apply flex flex-wrap justify-center bg-white border border-gray-200 rounded-md overflow-hidden;
}

:deep(.vue-flow__controls button) {
  @apply size-8 p-2 bg-white text-gray-700;
}

:deep(.vue-flow__controls button[disabled]) {
  @apply opacity-50 cursor-not-allowed;
}

:deep(.vue-flow__controls button:hover) {
  @apply bg-gray-100;
}

:deep(.vue-flow__controls-button svg) {
  @apply size-full;
}

.vue-flow__minimap {
  @apply scale-75 origin-bottom-right;
}
</style>
