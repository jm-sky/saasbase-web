import { useI18n } from 'vue-i18n'

export const money = (amount: number, currency: string) => {
  const { locale } = useI18n()

  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency,
  }).format(amount)
}