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
  label?: string
  name: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <FormField v-slot="{ componentField, meta }" :name>
    <FormItem :class="cn('flex items-center gap-1.5 space-y-0', props.class)">
      <FormControl>
        <slot :component-field />
      </FormControl>
      <FormLabel v-if="label">
        {{ label }}
        <span
          v-if="meta.required"
          class="text-destructive"
        >*</span>
      </FormLabel>
      <FormDescription />
      <FormMessage />
    </FormItem>
  </FormField>
</template>
