<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguageStore } from '@/stores/language.store'

const languageStore = useLanguageStore()

const languages = [
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polish' }
]

const switchLanguage = (langCode: 'en' | 'pl') => {
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
        v-for="lang in languages"
        :key="lang.code"
        @click="switchLanguage(lang.code as 'en' | 'pl')"
      >
        <Icon icon="lucide:languages" class="mr-2" />
        <span>{{ lang.label }}</span>
        <span class="ml-2 text-xs text-muted-foreground">({{ lang.code.toUpperCase() }})</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
