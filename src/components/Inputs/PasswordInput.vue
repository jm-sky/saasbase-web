<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { type HTMLAttributes, ref } from 'vue'
import Input from '../ui/input/Input.vue'
import UIIcon from '../UIIcon.vue'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<(e: 'update:modelValue', payload: string | number) => void>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const isPasswordVisible = ref(false)
</script>

<template>
  <div class="relative">
    <UIIcon
      :icon="isPasswordVisible ? 'lucide:eye' : 'lucide:eye-off'"
      class="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground cursor-pointer"
      @click="isPasswordVisible = !isPasswordVisible"
    />
    <Input
      v-model="modelValue"
      v-bind="$attrs"
      :type="isPasswordVisible ? 'text' : 'password'"
      class="bg-white/50 dark:bg-black/50"
      :class="props.class"
    />
  </div>
</template>