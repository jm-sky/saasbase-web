import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default: 'border border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        primary: 'border border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        secondary: 'border border-transparent bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        light: 'border border-border bg-background/50 text-secondary-foreground shadow-xs hover:bg-secondary/80',
        destructive: 'border border-transparent bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'border bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        'outline-destructive': 'border border-destructive bg-transparent text-destructive shadow-xs hover:bg-destructive/5 hover:text-destructive dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        'ghost-primary':
          'hover:bg-sky-300/20 hover:text-primary dark:hover:bg-primary/50',
        'ghost-destructive':
          'hover:bg-destructive/2 hover:text-destructive',
        transparent: 'bg-transparent text-foreground/50 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: 'h-7 rounded gap-1 px-2 has-[>svg]:px-2',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5', // It's like h-9 (h-8 + padding)
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        xl: 'h-12 rounded-md px-8 has-[>svg]:px-6 text-lg',
        icon: 'size-9', // It's like size 'sm' (h-8 + padding)
      },
      vibe: {
        primary: 'relative overflow-hidden shadow-2xl duration-300 before:-z-1 before:absolute before:h-0 before:w-0 before:rounded-full before:bg-white before:duration-200 before:ease-out hover:text-primary hover:shadow-primary-800/50 dark:hover:shadow-primary-300/50 hover:before:h-56 hover:before:w-56 hover:before:blur-md hover:scale-110 hover:ring',
        outline: 'duration-200 hover:outline-2 hover:bg-white outline-primary-500 outline-offset-4 hover:ring hover:ring-primary hover:scale-105 hover:text-primary hover:shadow-2xl hover:shadow-primary-800/50 dark:hover:shadow-primary-300/50',
        underline: 'rounded-b-none relative before:absolute before:bottom-0 before:rounded-md before:h-0.5 before:w-0 before:bg-primary before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:text-primary hover:bg-transparent dark:hover:bg-transparent',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
