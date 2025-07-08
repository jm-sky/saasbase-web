import type { TTagColor } from '@/domains/tags/types/tag.type'

export const tagColor = (color: TTagColor): string => {
  switch (color) {
    case 'danger':
      return 'bg-destructive/10 text-destructive border border-destructive/20'
    case 'danger-intense':
      return 'bg-destructive text-destructive-foreground border border-destructive'
    case 'dark':
      return 'bg-slate-800/20 text-slate-800/70 border border-slate-800/50'
    case 'dark-intense':
      return 'bg-slate-800 text-slate-200 border border-slate-800'
    case 'info':
      return 'bg-info/10 text-info border border-info/20'
    case 'info-intense':
      return 'bg-info text-info-foreground border border-info'
    case 'notice':
      return 'bg-standout/10 text-standout border border-standout/20'
    case 'notice-intense':
      return 'bg-standout text-standout-foreground border border-standout'
    case 'success':
      return 'bg-success/10 text-success border border-success/20'
    case 'success-intense':
      return 'bg-success text-success-foreground border border-success'
    case 'warning':
      return 'bg-warning/10 text-warning border border-warning/20'
    case 'warning-intense':
      return 'bg-warning text-warning-foreground border border-warning'
    default:
      return 'bg-muted text-muted-foreground border border-muted/20'
  }
}