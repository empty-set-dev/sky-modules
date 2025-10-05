import { recipe } from '@sky-modules/design/recipe';
export const hstackRecipe = recipe({
  base: 'hstack',
  variants: {
    spacing: {
      none: 'hstack--spacing-none',
      xs: 'hstack--spacing-xs',
      sm: 'hstack--spacing-sm',
      md: 'hstack--spacing-md',
      lg: 'hstack--spacing-lg',
      xl: 'hstack--spacing-xl'
    },
    align: {
      start: 'hstack--align-start',
      center: 'hstack--align-center',
      end: 'hstack--align-end',
      stretch: 'hstack--align-stretch'
    },
    justify: {
      start: 'hstack--justify-start',
      center: 'hstack--justify-center',
      end: 'hstack--justify-end',
      between: 'hstack--justify-between',
      around: 'hstack--justify-around',
      evenly: 'hstack--justify-evenly'
    },
    wrap: {
      true: 'hstack--wrap'
    },
    reverse: {
      true: 'hstack--reverse'
    }
  },
  defaultVariants: {
    spacing: 'md',
    align: 'center',
    justify: 'start'
  }
})