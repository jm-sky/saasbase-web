import type { LucideIcon } from 'lucide-vue-next'

export interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: MenuItem[]
}
