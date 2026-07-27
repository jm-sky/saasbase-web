<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { Input } from '@/components/ui/input'
import Button from '../ui/button/Button.vue'

defineProps<{
  disabled?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <div
    v-tooltip="disabled ? t('common.searchComingSoon') : undefined"
    class="flex items-center gap-2"
  >
    <Button
      variant="ghost"
      size="icon"
      :disabled
      class="md:hidden"
    >
      <Icon icon="lucide:search" />
    </Button>
    <Input
      type="search"
      :placeholder="t('common.search')"
      class="hidden md:flex md:w-[100px] lg:w-[300px]"
      :disabled
    />
  </div>
</template>
