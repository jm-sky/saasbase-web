import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { config } from '@/config'
import type { TLocale } from '@/i18n'

export const useLanguageStore = defineStore('language', () => {
  const { locale, availableLocales } = useI18n()
  const currentLocale = useLocalStorage<TLocale>(`${config.appId}:locale`, 'en')

  const setLocale = (newLocale: TLocale) => {
    currentLocale.value = newLocale
    locale.value = newLocale
  }

  watch(currentLocale, (newLocale) => {
    locale.value = newLocale
  }, {
    immediate: true,
  })

  return {
    currentLocale,
    availableLocales: availableLocales as TLocale[],
    setLocale
  }
})
