import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      message: {
        hello: 'hello world',
      },
    },
  },
});
