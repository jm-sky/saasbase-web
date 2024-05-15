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
  label: string
}>();
</script>

<template>
  <FormField
    v-slot="{ componentField, meta }"
    :name
  >
    <FormItem>
      <FormLabel>
        {{ label }}
        <span
          v-if="meta.required"
          class="text-red-500"
        >*</span>
      </FormLabel>
      <FormControl>
        <slot :component-field />
      </FormControl>
      <FormDescription />
      <FormMessage />
    </FormItem>
  </FormField>
</template>
