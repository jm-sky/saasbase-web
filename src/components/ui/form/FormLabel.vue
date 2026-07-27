<script lang="ts" setup>
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useFormField } from './useFormField'
import type { LabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<LabelProps & {
  class?: HTMLAttributes['class']
  disabled?: boolean
}>()

const { error, formItemId } = useFormField()
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="!!error"
    :class="cn(
      'data-[error=true]:text-destructive',
      props.disabled && 'opacity-50',
      props.class,
    )"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
