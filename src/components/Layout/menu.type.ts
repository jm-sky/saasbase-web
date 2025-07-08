import type { LucideIcon } from 'lucide-vue-next'

export interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: MenuItem[]
  locked?: boolean
  soon?: boolean
  isCategory?: false
}

export interface MenuCategory {
  title: string
  isCategory: true
}

export type MenuItemOrMenuCategory = MenuItem | MenuCategory
