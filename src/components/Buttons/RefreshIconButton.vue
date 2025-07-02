<script setup lang="ts">
import { RefreshCcwIcon } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'

defineProps<{
  loading?: boolean
}>()
</script>

<template>
  <Button variant="ghost" :loading>
    <RefreshCcwIcon class="size-4" />
  </Button>
</template>
