import { recipe } from '@sky-modules/design/recipe';
export const rowRecipe = recipe({
  base: 'row',
  variants: {
    gutter: {
      none: 'row--gutter-none',
      xs: 'row--gutter-xs',
      sm: 'row--gutter-sm',
      md: 'row--gutter-md',
      lg: 'row--gutter-lg',
      xl: 'row--gutter-xl'
    },
    align: {
      top: 'row--align-top',
      middle: 'row--align-middle',
      bottom: 'row--align-bottom',
      stretch: 'row--align-stretch'
    },
    justify: {
      start: 'row--justify-start',
      center: 'row--justify-center',
      end: 'row--justify-end',
      between: 'row--justify-between',
      around: 'row--justify-around',
      evenly: 'row--justify-evenly'
    },
    wrap: {
      true: 'row--wrap',
      reverse: 'row--wrap-reverse'
    },
    reverse: {
      true: 'row--reverse'
    }
  },
  defaultVariants: {
    gutter: 'md',
    align: 'top',
    justify: 'start'
  }
})