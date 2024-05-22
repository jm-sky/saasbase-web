<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

defineProps<{
  name: string
  label?: string
}>();
</script>

<template>
  <FormField
    v-slot="{ componentField, meta }"
    :name
  >
    <FormItem class="flex items-center gap-1.5 space-y-0">
      <FormControl>
        <slot :component-field />
      </FormControl>
      <FormLabel
        v-if="label"
        class="font-normal my-0 leading-none"
      >
        {{ label }}
        <span
          v-if="meta.required"
          class="text-destructive"
        >*</span>
      </FormLabel>
    </FormItem>
    <FormDescription />
    <FormMessage />
  </FormField>
</template>
