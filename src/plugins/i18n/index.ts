import { createI18n } from 'vue-i18n';
import { en } from '@/plugins/i18n/en';

export type TLocale = 'en'
export type MessageSchema = typeof en;

export const i18n = createI18n<[MessageSchema], TLocale>({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
  },
});
