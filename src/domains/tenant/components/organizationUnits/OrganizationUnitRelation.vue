<script setup lang="ts">
import { BaseEdge, type EdgeProps, getBezierPath } from '@vue-flow/core'
import { computed } from 'vue'

const edgeProps = defineProps<EdgeProps>()

const path = computed(() => getBezierPath(edgeProps))
</script>

<script lang="ts">
export default {
  name: 'CustomEdge',
}
</script>

<template>
  <BaseEdge
    :id="id"
    :style="style"
    :path="path[0]"
    :marker-end="markerEnd"
  />
</template>
