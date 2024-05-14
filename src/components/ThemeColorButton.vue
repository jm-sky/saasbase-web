<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Button from '@/components/ui/button/Button.vue';
import Label from '@/components/ui/label/Label.vue';
import { useThemeStore } from '@/stores/theme';

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
      <Label>{{ $t('common.Color') }}</Label>
      <div class="grid grid-cols-3 gap-2">
        <Button
          v-for="color in colors"
          :key="color.name"
          variant="outline"
          class="gap-2 justify-start text-xs"
          size="sm"
          :class="{ 'ring': color.isActive }"
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
      <div class="text-xs text-gray-500 pt-2">
        Current color is: <span class="capitalize font-bold">{{ themeColor }}</span>
      </div>
    </PopoverContent>
  </Popover>
</template>
