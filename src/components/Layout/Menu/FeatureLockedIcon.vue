<script setup lang="ts">
import { Lock } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <Lock v-tooltip="t('common.feature.locked')" />
</template>
