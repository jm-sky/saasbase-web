<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  disabled?: boolean
  label?: string
  name: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <FormField v-slot="{ componentField, meta, value, handleChange }" :name>
    <FormItem :class="props.class">
      <FormLabel v-if="label">
        {{ label }}
        <span
          v-if="meta.required"
          class="text-destructive"
        >*</span>
      </FormLabel>
      <FormControl :disabled>
        <slot :component-field :value :handle-change />
      </FormControl>
      <FormDescription />
      <FormMessage />
    </FormItem>
  </FormField>
</template>
