import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        success: 'border-transparent bg-success text-success-foreground hover:bg-success/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        dark: 'border-transparent bg-gray-800 text-white hover:bg-gray-700',
        info: 'border-transparent bg-info text-info-foreground hover:bg-info/80',
        standout: 'border-transparent bg-standout text-standout-foreground hover:bg-standout/80',
        'success-outline': 'border-success/50 text-success bg-success/10',
        'destructive-outline': 'border-destructive/50 text-destructive bg-destructive/10',
        'info-outline': 'border-info/50 text-info bg-info/10',
        'standout-outline': 'border-standout/50 text-standout bg-standout/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
