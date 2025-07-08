
<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'

const files = defineModel<File[]>('files', { required: true })

const removeFile = (file: File) => {
  files.value = files.value.filter(f => f.name !== file.name)
}
</script>

<template>
  <div class="flex flex-col gap-2 text-sm">
    <div v-for="file in files" :key="file.name" class="flex flex-row items-center justify-between border border-gray-200 rounded-md px-3 py-1">
      <p>{{ file.name }}</p>
      <Button
        variant="outline"
        size="icon"
        class="-mr-1"
        @click="removeFile(file)"
      >
        <Trash2 class="size-4" />
      </Button>
    </div>
  </div>
</template>