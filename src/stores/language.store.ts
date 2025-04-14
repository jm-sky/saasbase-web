import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { config } from '@/config'
import { i18n } from '@/i18n'
import type { TLocale } from '@/i18n'

export const useLanguageStore = defineStore('language', () => {
  const currentLocale = useLocalStorage<TLocale>(`${config.appId}:locale`, 'en')

  const setLocale = (locale: TLocale) => {
    currentLocale.value = locale
    i18n.global.locale = locale
  }

  return {
    currentLocale,
    setLocale
  }
})
