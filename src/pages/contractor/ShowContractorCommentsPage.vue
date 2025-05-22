<script setup lang="ts">
import ContractorCommentsList from '@/domains/contractor/components/comments/ContractorCommentsList.vue'
import type { IContractor } from '@/domains/contractor/models/contractor.model'

const { contractor } = defineProps<{
  contractor: IContractor
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <ContractorCommentsList :contractor />
  </div>
</template>