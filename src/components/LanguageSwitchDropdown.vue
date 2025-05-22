<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { Button, type ButtonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguageStore } from '@/stores/language.store'
import type { HTMLAttributes } from 'vue'
import type { TLocale } from '@/i18n'

const { t } = useI18n()
const languageStore = useLanguageStore()

const props = defineProps<{
  variant?: ButtonVariants['variant']
  class?: HTMLAttributes['class']
  withLabel?: boolean
}>()

const switchLanguage = (langCode: TLocale) => {
  languageStore.setLocale(langCode)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        :variant="variant ?? 'ghost'"
        :class="props.class"
        class="h-9 gap-1"
      >
        <Icon icon="lucide:languages" class="hidden md:block" :class="{ 'mr-2': withLabel }" />
        <span v-if="withLabel">
          {{ languageStore.currentLocale.toUpperCase() }}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="locale in languageStore.availableLocales"
        :key="locale"
        class="cursor-pointer"
        @click="switchLanguage(locale)"
      >
        <span>{{ t(`common.language.${locale}`) }}</span>
        <span class="ml-2 text-xs text-muted-foreground">({{ locale.toUpperCase() }})</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
