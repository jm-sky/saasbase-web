<script setup lang="ts">
import { Position } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { Edit, Plus, Trash } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'

defineProps<{
  addable?: boolean
  editable?: boolean
  removeable?: boolean
  isSelected?: boolean
}>()

const emit = defineEmits<{
  'add-child': []
  'edit': []
  'remove': []
}>()
</script>


<template>
  <NodeToolbar :is-visible="isSelected" :position="Position.Left" class="flex flex-col gap-2 bg-card/80 border p-2 shadow rounded-xl">
    <Button
      v-if="addable"
      variant="ghost"
      size="icon"
      @click="emit('add-child')"
    >
      <Plus class="size-4" />
    </Button>
    <Button
      v-if="editable"
      variant="ghost"
      size="icon"
      @click="emit('edit')"
    >
      <Edit class="size-4" />
    </Button>
    <Button
      v-if="removeable"
      variant="ghost"
      size="icon"
      class="hover:text-destructive"
      @click="emit('remove')"
    >
      <Trash class="size-4" />
    </Button>
  </NodeToolbar>
</template>
