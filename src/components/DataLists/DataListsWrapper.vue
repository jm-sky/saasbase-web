<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ButtonLink from '../ButtonLink.vue'
import Button from '../ui/button/Button.vue'

const { t } = useI18n()

defineProps<{
  title: string
  addRoute?: string
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <div class="px-4 md:px-8 py-4 md:py-6 mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        {{ title }}
      </h1>
      <div class="flex gap-2">
        <slot name="actions">
          <Button variant="outline" @click="emit('refresh')">
            <RefreshCw class="h-4 w-4" />
          </Button>
          <ButtonLink v-if="addRoute" variant="default" :to="addRoute">
            Add
          </ButtonLink>
        </slot>
      </div>
    </div>

    <div v-if="loading" class="my-6 text-center py-8">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="error" class="my-6 text-center px-6 py-3 text-red-500 border-red-500 border-2 rounded-md">
      {{ error }}
    </div>

    <slot />
  </div>
</template>
