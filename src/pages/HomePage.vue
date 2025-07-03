<script setup lang="ts">
import Dashboard from '@/components/Dashboard/Dashboard.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
</script>

<template>
  <AuthenticatedLayout>
    <Dashboard />
  </AuthenticatedLayout>
</template>
