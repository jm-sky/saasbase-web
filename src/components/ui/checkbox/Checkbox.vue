<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { CheckboxRootEmits, CheckboxRootProps } from 'radix-vue'

const props = defineProps<CheckboxRootProps & { class?: HTMLAttributes['class'], withContent?: boolean }>()
const emits = defineEmits<CheckboxRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props // eslint-disable-line @typescript-eslint/no-unused-vars

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="
      cn('peer shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ',
         withContent ? 'border border-muted-foreground rounded-md p-2 flex items-center gap-2' : 'size-4',
         withContent ? 'data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary' : ' data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
         props.class)"
  >
    <slot name="content">
      <CheckboxIndicator class="flex h-full w-full items-center justify-center text-current">
        <slot>
          <Check class="size-4" />
        </slot>
      </CheckboxIndicator>
    </slot>
  </CheckboxRoot>
</template>
