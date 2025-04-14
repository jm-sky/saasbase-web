import { createI18n } from 'vue-i18n'
import { en } from '@/i18n/locales/en'
import { pl } from '@/i18n/locales/pl'

export type TLocale = 'en' | 'pl'
export type MessageSchema = typeof en;

export const DEFAULT_LOCALE: TLocale = 'en'

export const i18n = createI18n<[MessageSchema], TLocale>({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
    pl,
  },
})
