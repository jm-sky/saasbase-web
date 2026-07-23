<script setup lang="ts">
import { RouterView } from 'vue-router'
import PwaUpdatePrompt from '@/components/PwaUpdatePrompt.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <RouterView />
  <Toaster />
  <PwaUpdatePrompt />
</template>
