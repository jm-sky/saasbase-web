<script setup lang="ts">
import type { ITenant } from '@/domains/tenant/types/tenant.type'

defineProps<{
  tenant?: ITenant
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <h2 class="font-bold">
      Branding
    </h2>
  </div>
</template>