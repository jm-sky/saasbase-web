import { parseISO } from 'date-fns'
import { useI18n } from 'vue-i18n'

export const toDateString = (date: Date | string): string => {
  const { locale } = useI18n()

  if (typeof date === 'string') {
    date = parseISO(date)
  }

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
