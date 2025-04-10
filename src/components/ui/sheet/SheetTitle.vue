<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DialogTitle
    data-slot="sheet-title"
    :class="cn('text-foreground font-semibold', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogTitle>
</template>
