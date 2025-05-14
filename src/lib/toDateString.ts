import { parseISO } from 'date-fns'

export const toDateString = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
