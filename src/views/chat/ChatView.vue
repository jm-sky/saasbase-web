<script lang="ts" setup>
import ChatTest from '@/domains/chat/components/ChatTest.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
</script>

<template>
  <AuthenticatedLayout>
    <div class="p-8">
      <ChatTest />
    </div>
  </AuthenticatedLayout>
</template>
