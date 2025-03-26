<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

defineProps<{
  disabled?: boolean
  label?: string
  name: string
}>()
</script>

<template>
  <FormField
    v-slot="{ componentField, meta }"
    :name
  >
    <FormItem>
      <FormLabel v-if="label">
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
