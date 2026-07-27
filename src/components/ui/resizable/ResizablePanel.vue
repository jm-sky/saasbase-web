<script setup lang="ts">
import { SplitterPanel, useForwardPropsEmits } from 'reka-ui'
import type { SplitterPanelEmits, SplitterPanelProps } from 'reka-ui'

const props = defineProps<SplitterPanelProps>()
const emits = defineEmits<SplitterPanelEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <SplitterPanel
    data-slot="resizable-panel"
    v-bind="forwarded"
  >
    <slot />
  </SplitterPanel>
</template>
