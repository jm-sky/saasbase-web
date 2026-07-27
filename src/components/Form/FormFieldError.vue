<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed } from 'vue'

const props = defineProps<{
  name: string
}>()

const { errorMessage } = useField(props.name, undefined, {
  validateOnValueUpdate: false,
})

const hasError = computed(() => Boolean(errorMessage.value))
</script>

<template>
  <div v-if="hasError" class="text-sm text-red-600 mt-1">
    {{ errorMessage }}
  </div>
</template>