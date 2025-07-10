<script setup lang="ts">
import EntityDetailsHeader from './EntityDetailsHeader.vue'

const { showSidebar = true } = defineProps<{
  title: string
  backLink: string
  editLink?: string
  loading?: boolean
  notRefreshable?: boolean
  showSidebar?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <div class="px-4 md:px-6 py-4 md:py-6 flex flex-col gap-y-6" data-testid="entity-details-layout">
    <!-- Header -->
    <EntityDetailsHeader
      :title="title"
      :back-link="backLink"
      :edit-link="editLink"
      :loading="loading"
      :not-refreshable="notRefreshable"
      @refresh="emit('refresh')"
    />

    <!-- Content -->
    <div
      class="grid grid-cols-1 gap-6"
      :class="{ 'opacity-50': loading, 'lg:grid-cols-[15rem_1fr] xl:grid-cols-[20rem_1fr] ': showSidebar }"
    >
      <!-- Sidebar -->
      <div v-if="showSidebar" class="flex flex-col text-center gap-2 border rounded-md px-6 py-4 shadow-lg/5">
        <slot name="sidebar" />
      </div>

      <!-- Main content -->
      <div class="flex flex-col gap-4">
        <div v-if="$slots.tabs" class="flex flex-row items-center gap-2 font-semibold whitespace-nowrap overflow-x-auto">
          <slot name="tabs" />
        </div>

        <slot name="content" />
      </div>
    </div>
  </div>
</template>
