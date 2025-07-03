export const money = (
  amount: number,
  currency: string | null = null,
  locale: string,
  currencyDisplay: 'code' | 'symbol' | 'name' = 'code'
) => {
  if (!currency) {
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    useGrouping: true,
    currencyDisplay,
    currency,
  }).format(amount)
}
