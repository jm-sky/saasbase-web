<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  disabled?: boolean
  label?: string
  name: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <FormField v-slot="{ componentField, meta }" :name>
    <FormItem :class="cn('flex items-baseline flex-wrap lg:flex-nowrap gap-2.5', props.class)">
      <FormLabel v-if="label" class="w-full max-w-56">
        {{ label }}
        <span
          v-if="meta.required"
          class="text-destructive"
        >*</span>
      </FormLabel>
      <FormControl :disabled>
        <slot :component-field />
      </FormControl>
      <FormDescription />
      <FormMessage />
    </FormItem>
  </FormField>
</template>
