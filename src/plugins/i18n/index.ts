import { createI18n } from 'vue-i18n';
import { en } from '@/plugins/i18n/en';

export type TLocale = 'en'
export type MessageSchema = typeof en;

export const DEFAULT_LOCALE: TLocale = 'en';

export const i18n = createI18n<[MessageSchema], TLocale>({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
  },
});
