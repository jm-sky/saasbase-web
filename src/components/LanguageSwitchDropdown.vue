<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguageStore } from '@/stores/language.store'
import type { TLocale } from '@/i18n'

const { t } = useI18n()
const languageStore = useLanguageStore()

const switchLanguage = (langCode: TLocale) => {
  languageStore.setLocale(langCode)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-9 px-3 gap-1">
        <Icon icon="lucide:languages" class="mr-2" />
        {{ languageStore.currentLocale.toUpperCase() }}
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
