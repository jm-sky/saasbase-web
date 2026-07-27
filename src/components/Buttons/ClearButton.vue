<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Button from '../ui/button/Button.vue'

const { t } = useI18n()
</script>

<template>
  <Button
    v-tooltip="t('common.clear')"
    variant="transparent"
    type="button"
    size="icon"
  >
    <X class="size-4" />
  </Button>
</template>
