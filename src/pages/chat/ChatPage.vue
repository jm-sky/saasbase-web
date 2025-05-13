<script lang="ts" setup>
import ChatFullPageComponent from '@/domains/chat/components/ChatFullPageComponent.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
</script>

<template>
  <AuthenticatedLayout>
    <ChatFullPageComponent />
  </AuthenticatedLayout>
</template>
