<script lang="ts" setup>
import { ErrorMessage } from 'vee-validate'
import { type HTMLAttributes, toValue } from 'vue'
import { cn } from '@/lib/utils'
import { useFormField } from './useFormField'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { name, formMessageId } = useFormField()
</script>

<template>
  <Transition
    enter-from-class="opacity-0 -translate-y-5"
    enter-active-class="transition"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-active-class="transition"
    leave-to-class="opacity-0 -translate-y-5"
  >
    <ErrorMessage
      :id="formMessageId"
      data-slot="form-message"
      as="p"
      :name="toValue(name)"
      :class="cn('text-destructive-foreground text-sm', props.class)"
    />
  </Transition>
</template>
