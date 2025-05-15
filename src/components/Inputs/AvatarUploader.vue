<script setup lang="ts">
import { Trash, Upload } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

defineProps<{
  fallbackText?: string
  disabled?: boolean
}>()

const file = defineModel<File | null>()
const fileInput = ref<HTMLInputElement>()

const previewUrl = computed(() =>
  file.value ? URL.createObjectURL(file.value) : null
)

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const selected = target.files?.[0] ?? null
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
      <AvatarFallback>{{ fallbackText ?? '-' }}</AvatarFallback>
    </Avatar>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      :disabled
      @change="onFileChange"
    >

    <button
      class="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
      :disabled
      type="button"
      @click="fileInput?.click()"
    >
      <Upload class="w-4 h-4 text-gray-700" />
    </button>

    <button
      v-if="file"
      class="absolute top-0 right-0 p-1.5 bg-white rounded-full shadow hover:bg-red-100"
      :disabled
      type="button"
      @click="removeFile"
    >
      <Trash class="w-4 h-4 text-red-500" />
    </button>
  </div>
</template>
