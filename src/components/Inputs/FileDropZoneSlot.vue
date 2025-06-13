<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  hideLabel?: boolean
}>()

const isActive = defineModel<boolean>('isActive', { default: false })
const draggedFiles = defineModel<File[]>('draggedFiles', { required: true })

const isDragging = ref(false)

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  if (e.dataTransfer?.files) {
    draggedFiles.value = Array.from(e.dataTransfer.files)
    isActive.value = true
    isDragging.value = false
  }
}

</script>

<template>
  <div
    class="relative transition-colors"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Drop zone overlay -->
    <Transition name="fade">
      <div
        v-if="isDragging"
        class="absolute inset-0 z-20 flex items-center justify-center bg-primary/10 outline-4 outline-primary/50 outline-dashed border-primary rounded-lg pointer-events-none"
      >
        <span v-if="!hideLabel" class="text-primary text-lg font-semibold">
          {{ t('common.fileUpload.dropHere', 'Drop files to upload') }}
        </span>
      </div>
    </Transition>
    <slot />
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>