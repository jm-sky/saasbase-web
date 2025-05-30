<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ButtonLink from '../ButtonLink.vue'
import LoadingIcon from '../Icons/LoadingIcon.vue'
import Alert from '../ui/alert/Alert.vue'
import AlertDescription from '../ui/alert/AlertDescription.vue'
import AlertTitle from '../ui/alert/AlertTitle.vue'
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
  <div class="px-4 md:px-8 py-4 md:py-6 mx-auto relative">
    <div class="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
      <h1 class="text-2xl font-bold">
        {{ title }}
      </h1>
      <div class="flex gap-2">
        <slot name="actions">
          <Button variant="outline" @click="emit('refresh')">
            <RefreshCw class="h-4 w-4" />
          </Button>
          <ButtonLink v-if="addRoute" variant="default" :to="addRoute">
            {{ t('common.add') }}
          </ButtonLink>
        </slot>
      </div>
    </div>

    <Alert v-if="error" variant="destructive" class="mb-4">
      <AlertTitle>
        {{ t('common.error') }}
      </AlertTitle>
      <AlertDescription>
        {{ error }}
      </AlertDescription>
    </Alert>

    <slot />

    <div v-if="loading" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-30 rounded-2xl flex items-center gap-3 shadow-xl justify-center bg-white/50 backdrop-blur-sm border">
      <LoadingIcon />
      <span class="text-sm">{{ t('common.loading') }}</span>
    </div>
  </div>
</template>
