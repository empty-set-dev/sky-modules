import { recipe } from '@sky-modules/design/recipe';
export const textRecipe = recipe({
  base: 'text',
  variants: {
    size: {
      xs: 'text--size-xs',
      sm: 'text--size-sm',
      md: 'text--size-md',
      lg: 'text--size-lg',
      xl: 'text--size-xl',
      '2xl': 'text--size-2xl',
      '3xl': 'text--size-3xl',
      '4xl': 'text--size-4xl',
      '5xl': 'text--size-5xl',
      '6xl': 'text--size-6xl'
    },
    align: {
      left: 'text--align-left',
      center: 'text--align-center',
      right: 'text--align-right',
      justify: 'text--align-justify'
    },
    casing: {
      uppercase: 'text--casing-uppercase',
      lowercase: 'text--casing-lowercase',
      capitalize: 'text--casing-capitalize'
    },
    decoration: {
      underline: 'text--decoration-underline',
      'line-through': 'text--decoration-line-through'
    },
    truncate: {
      true: 'text--truncate'
    },
    noWrap: {
      true: 'text--no-wrap'
    }
  },
  defaultVariants: {
    size: 'md'
  }
})