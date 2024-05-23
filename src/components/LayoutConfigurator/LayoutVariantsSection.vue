<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Button from '@/components/ui/button/Button.vue';
import Label from '@/components/ui/label/Label.vue';
import { useTranslate } from '@/composables/useTranslate';
import { useThemeStore } from '@/stores/theme.store';

const layoutStore = useThemeStore();
const tr = useTranslate();

const { guestLayoutVariant } = storeToRefs(layoutStore);
</script>

<template>
  <div class="space-y-2">
    <Label class="font-bold">{{ tr('common.ThemeVariants') }}</Label>
    <div class="grid grid-cols-2 gap-2">
      <Button
        :variant="guestLayoutVariant === 'centered' ? 'secondary' : 'outline'"
        @click="guestLayoutVariant = 'centered'"
      >
        {{ tr('Login Centered') }}
      </Button>
      <Button
        :variant="guestLayoutVariant === 'two-columns' ? 'secondary' : 'outline'"
        @click="guestLayoutVariant = 'two-columns'"
      >
        {{ tr('Login Two-Columns') }}
      </Button>
    </div>
  </div>
</template>
