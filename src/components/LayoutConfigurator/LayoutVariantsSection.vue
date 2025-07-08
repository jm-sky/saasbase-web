<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import Label from '@/components/ui/label/Label.vue'
import { useThemeStore } from '@/stores/theme.store'

const { t } = useI18n()

const layoutStore = useThemeStore()

const { guestLayoutVariant } = storeToRefs(layoutStore)
</script>

<template>
  <div class="space-y-2">
    <Label class="font-bold">{{ t('common.ThemeVariants') }}</Label>
    <div class="grid grid-cols-2 gap-2">
      <Button
        :variant="guestLayoutVariant === 'centered' ? 'secondary' : 'outline'"
        @click="guestLayoutVariant = 'centered'"
      >
        {{ t('Login Centered') }}
      </Button>
      <Button
        :variant="guestLayoutVariant === 'two-columns' ? 'secondary' : 'outline'"
        @click="guestLayoutVariant = 'two-columns'"
      >
        {{ t('Login Two-Columns') }}
      </Button>
    </div>
  </div>
</template>
