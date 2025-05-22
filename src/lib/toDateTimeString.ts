import { parseISO } from 'date-fns'

export const toDateTimeString = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
}
