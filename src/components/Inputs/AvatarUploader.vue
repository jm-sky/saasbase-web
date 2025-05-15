<script setup lang="ts">
import { ref, computed } from 'vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Upload, Trash } from 'lucide-vue-next'

const file = defineModel<File | null>()
const fileInput = ref<HTMLInputElement>()

const previewUrl = computed(() =>
  file.value ? URL.createObjectURL(file.value) : null
)

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const selected = target.files?.[0] || null
  if (selected) {
    file.value = selected
    target.value = ''
  }
}

const removeFile = () => {
  file.value = null
}
</script>

<template>
  <div class="relative inline-block">
    <Avatar class="w-24 h-24 border shadow">
      <AvatarImage v-if="previewUrl" :src="previewUrl" alt="avatar" />
      <AvatarFallback>{{ props.fallbackText || '??' }}</AvatarFallback>
    </Avatar>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      :disabled="disabled"
      @change="onFileChange"
    />

    <button
      class="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
      @click="fileInput?.click()"
      :disabled="disabled"
      type="button"
    >
      <Upload class="w-4 h-4 text-gray-700" />
    </button>

    <button
      v-if="file"
      class="absolute top-0 right-0 p-1.5 bg-white rounded-full shadow hover:bg-red-100"
      @click="removeFile"
      :disabled="disabled"
      type="button"
    >
      <Trash class="w-4 h-4 text-red-500" />
    </button>
  </div>
</template>
