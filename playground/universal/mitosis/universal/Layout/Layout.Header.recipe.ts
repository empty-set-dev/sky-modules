import { recipe } from '@sky-modules/design/recipe';
export const layoutHeaderRecipe = recipe({
  base: 'layout-header',
  variants: {
    variant: {
      default: 'layout-header--default',
      minimal: 'layout-header--minimal',
      navbar: 'layout-header--navbar',
      banner: 'layout-header--banner',
      toolbar: 'layout-header--toolbar'
    },
    sticky: {
      true: 'layout-header--sticky',
      top: 'layout-header--sticky-top'
    },
    shadow: {
      none: 'layout-header--shadow-none',
      sm: 'layout-header--shadow-sm',
      md: 'layout-header--shadow-md',
      lg: 'layout-header--shadow-lg'
    },
    border: {
      none: 'layout-header--border-none',
      bottom: 'layout-header--border-bottom',
      full: 'layout-header--border-full'
    },
    background: {
      transparent: 'layout-header--bg-transparent',
      solid: 'layout-header--bg-solid',
      blur: 'layout-header--bg-blur',
      gradient: 'layout-header--bg-gradient'
    },
    height: {
      sm: 'layout-header--height-sm',
      md: 'layout-header--height-md',
      lg: 'layout-header--height-lg',
      xl: 'layout-header--height-xl',
      auto: 'layout-header--height-auto'
    }
  },
  defaultVariants: {
    variant: 'default',
    shadow: 'sm',
    border: 'bottom',
    background: 'solid',
    height: 'md'
  }
})