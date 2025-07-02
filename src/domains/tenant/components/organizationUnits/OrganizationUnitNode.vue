<script setup lang="ts">
import type { IOrganizationUnit } from '../../types/organizationUnit.type'

defineProps<{
  data: IOrganizationUnit
  isRoot?: boolean
  isSelected?: boolean
}>()
</script>

<template>
  <div
    class="min-w-40 p-3 rounded-lg border shadow-sm transition-all duration-200 cursor-pointer"
    :class="[
      isRoot
        ? 'bg-slate-800 text-white border-slate-600 hover:border-slate-500'
        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5',
      isSelected && 'border-primary shadow-primary/10',
      isSelected && 'shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
    ]"
  >
    <div class="font-semibold text-sm leading-tight mb-1">
      {{ data.name }}
    </div>

    <div
      v-if="data.description"
      class="text-xs mb-1.5 leading-snug"
      :class="isRoot ? 'text-gray-300' : 'text-gray-600'"
    >
      {{ data.description }}
    </div>

    <div
      v-if="data.users?.length"
      class="text-xs font-medium mb-1"
      :class="isRoot ? 'text-gray-300' : 'text-gray-500'"
    >
      {{ data.users.length }} user{{ data.users.length !== 1 ? 's' : '' }}
    </div>

    <div
      v-if="data.code"
      class="text-xs px-2 py-1 rounded inline-block"
      :class="isRoot
        ? 'bg-white/10 text-gray-200'
        : 'text-gray-400 bg-gray-50'"
    >
      Code: {{ data.code }}
    </div>
  </div>
</template>
