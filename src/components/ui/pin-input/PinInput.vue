<script setup lang="ts">
import { PinInputRoot, type PinInputRootEmits, type PinInputRootProps, useForwardPropsEmits } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<PinInputRootProps & { class?: HTMLAttributes['class'] }>(), {
  modelValue: () => [],
})
const emits = defineEmits<PinInputRootEmits>()

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <PinInputRoot
    data-slot="pin-input"
    v-bind="forwarded"
    :class="cn('flex items-center gap-2 has-disabled:opacity-50 disabled:cursor-not-allowed', props.class)"
  >
    <slot />
  </PinInputRoot>
</template>
