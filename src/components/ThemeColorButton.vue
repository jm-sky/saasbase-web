<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import Label from '@/components/ui/label/Label.vue';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useThemeStore } from '@/stores/theme.store';

const themeStore = useThemeStore();

const { themeColor } = storeToRefs(themeStore);

const colors = computed(() => themeStore.allowedColors.map(name => ({
  name,
  isActive: name === themeColor.value,
})));
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
      >
        <Icon icon="lucide:paintbrush" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-96 space-y-3">
      <Label class="font-bold">{{ $t('common.ThemeColor') }}</Label>
      <div class="grid grid-cols-3 gap-2">
        <Button
          v-for="color in colors"
          :key="color.name"
          variant="outline"
          class="gap-2 justify-start text-xs"
          size="sm"
          :class="{ 'ring ring-primary/50': color.isActive }"
          @click="themeColor = color.name"
        >
          <span
            class="size-5 rounded-full flex items-center justify-center aspect-square text-white bg-primary"
            :class="`theme-${color.name}`"
          >
            {{ color.isActive ? '&check;' : '' }}
          </span>
          <span class="capitalize">{{ color.name }}</span>
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
