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
  name: string
  disabled?: boolean
  readonly?: boolean
  label?: string
  description?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <FormField v-slot="{ componentField, meta, value, handleChange }" :name>
    <FormItem :class="props.class">
      <FormLabel v-if="label" :disabled>
        {{ label }}
        <span
          v-if="meta.required"
          class="text-destructive"
        >*</span>
      </FormLabel>
      <FormControl :disabled :readonly>
        <slot :component-field :value :handle-change />
      </FormControl>
      <FormDescription>
        <slot name="description">
          {{ description }}
        </slot>
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
