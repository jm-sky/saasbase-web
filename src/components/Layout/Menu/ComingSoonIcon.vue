<script setup lang="ts">
import { Hourglass } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <Hourglass v-tooltip="t('common.feature.commingSoon')" />
</template>
