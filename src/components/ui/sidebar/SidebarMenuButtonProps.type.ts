import { type PrimitiveProps } from 'reka-ui'
import { type SidebarMenuButtonVariants } from '.'
import type { HTMLAttributes } from 'vue'

export interface SidebarMenuButtonProps extends PrimitiveProps {
  variant?: SidebarMenuButtonVariants['variant']
  size?: SidebarMenuButtonVariants['size']
  isActive?: boolean
  class?: HTMLAttributes['class']
}
