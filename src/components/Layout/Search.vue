<script setup lang="ts">
import { Input } from '@/components/ui/input'

defineProps<{
  disabled?: boolean
}>()
</script>

<template>
  <div>
    <Input
      type="search"
      placeholder="Search..."
      class="md:w-[100px] lg:w-[300px]"
      :disabled
    />
  </div>
</template>
