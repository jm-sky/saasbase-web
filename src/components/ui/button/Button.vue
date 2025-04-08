<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import { cn } from '@/lib/utils'
import { type ButtonVariants, buttonVariants } from '.'
import type { HTMLAttributes } from 'vue'

interface Props extends PrimitiveProps {
  label?: string
  loading?: boolean
  icon?: string
  class?: HTMLAttributes['class']
  size?: ButtonVariants['size']
  variant?: ButtonVariants['variant']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :disabled="loading"
  >
    <template v-if="loading">
      <LoadingIcon />
    </template>
    <template v-else>
      <i
        v-if="icon"
        :class="icon"
      />
      <slot>
        {{ label }}
      </slot>
    </template>
  </Primitive>
</template>
