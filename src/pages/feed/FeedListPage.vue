<script setup lang="ts">
import FeedList from '@/domains/feed/components/FeedList.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

</script>

<template>
  <AuthenticatedLayout>
    <div class="px-4 md:px-6 py-2 md:py-4">
      <FeedList />
    </div>
  </AuthenticatedLayout>
</template>