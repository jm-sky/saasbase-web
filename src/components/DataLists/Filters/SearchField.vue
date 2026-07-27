<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Input from '@/components/ui/input/Input.vue'

const { t } = useI18n()
const modelValue = defineModel<string | undefined>('modelValue', { required: true })
</script>

<template>
  <div class="flex items-center gap-2 relative w-36 focus-within:w-50 transition-all duration-300">
    <Input v-model="modelValue" :placeholder="t('common.search')" />
    <X v-if="modelValue" class="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" @click="modelValue = ''" />
  </div>
</template>
