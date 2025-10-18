import { recipe } from '@sky-modules/design/recipe';
export const headingRecipe = recipe({
  base: 'heading',
  variants: {
    size: {
      xs: 'heading--size-xs',
      sm: 'heading--size-sm',
      md: 'heading--size-md',
      lg: 'heading--size-lg',
      xl: 'heading--size-xl',
      '2xl': 'heading--size-2xl',
      '3xl': 'heading--size-3xl',
      '4xl': 'heading--size-4xl',
      '5xl': 'heading--size-5xl',
      '6xl': 'heading--size-6xl',
      '7xl': 'heading--size-7xl'
    }
  },
  defaultVariants: {
    size: 'xl'
  }
})