import { formatDistanceToNow } from 'date-fns'
import type { Locale } from 'date-fns'

export function timeAgo(date: Date | string, locale?: Locale): string {
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date
    if (isNaN(parsedDate.getTime())) return ''
    return formatDistanceToNow(parsedDate, { addSuffix: true, locale })
  } catch {
    return ''
  }
}
