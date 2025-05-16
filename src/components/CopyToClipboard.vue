<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { refAutoReset, useClipboard } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useToast } from './ui/toast'

const { t } = useI18n()
const { toast } = useToast()

const props = defineProps<{
  text?: string
}>()

const copied = refAutoReset(false, 1000)

const copyToClipboard = async () => {
  if (!props.text) return
  await useClipboard().copy(props.text)
  copied.value = true
  toast.info(t('common.copyToClipboard.success'))
}
</script>

<template>
  <button
    v-if="text"
    v-tooltip="copied ? t('common.copyToClipboard.copied') : t('common.copyToClipboard.copy')"
    type="button"
    class="opacity-50 hover:opacity-100 text-muted-foreground hover:text-primary"
    @click="copyToClipboard"
  >
    <slot>
      <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" />
    </slot>
  </button>
</template>